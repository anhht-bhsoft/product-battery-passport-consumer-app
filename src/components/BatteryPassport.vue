<template id="battery-passport-root">
  <Spinner v-if="loading" class="spinner-container" />
  <div v-else>
    <div data-cy="history-container" class="dashboard-container">
      <div class="titles-container">
        <div class="title">Welcome back {{ name }}!</div>
        <div class="sub-title">Batteries scanned today:</div>
        <!-- TODO: History of scanned batteries -->
        <!-- <div class="sub-title orange">See full history</div> -->
      </div>
      <DashboardTable />
    </div>
  </div>
</template>

<script type="text/jsx">
import Spinner from "@/components/Spinner.vue";
import DashboardTable from "@/components/DashboardTable.vue";
import { inject } from "vue";

let listBatteryProviders = require("../assets/providers.json");

export default {
  name: "BatteryPassport",
  components: {
    Spinner,

    DashboardTable,
  },
  data() {
    return {
      auth: inject("authentication"),
      loading: true,
      listProviders: listBatteryProviders,
      provider: {},
      selectedProvider: "",
      selectedBattery: "",
      assetIds: {},
      assetIdsVisible: false,
      name: "",
      MATERIAL_URL: process.env.VUE_APP_MATERIAL_URL,
    };
  },
  created() {
    this.loading = false;
  },

  mounted() {
    if (this.auth.isUserAuthenticated) {
      // User has an active session and using QR code feature
      let user = this.auth.getUserName();
      let role = this.auth.getRole();
      console.log("CurrentUser: ", user, " role: ", role);
      // check query params for QR code scanning
      this.selectedProvider = this.$route.query.provider;
      this.selectedBattery = this.$route.query.battery;
      this.selectedContract =
        this.$route.query.battery + "_" + role.toLowerCase();
      if (
        this.$route.query.provider === undefined ||
        this.$route.query.battery === undefined
      ) {
        // do manual selection of fields
        console.log("INFO: provider and battery are not defined");
        this.resetFields();
      } else if (
        this.validateFields(
          this.$route.query.provider,
          this.$route.query.battery
        )
      ) {
        // Get BatteryData from qr code
        this.getBatteryDataUsingQRCode();
      } else {
        alert("Battery provider and battery name are required...!");
      }
    }
  },
  methods: {
    getContractOfferByLoggedInRole: function () {
      let role = this.auth.getRole();
      const offer = this.provider.contractOffers.filter((h) =>
        h.includes(role.toLowerCase())
      );
      this.provider.contractOffers = offer;
      // to handle filling the battery provider dropdown here because this.provider is loaded before provider dropdown and get empty value.
      this.selectedProvider = this.provider.name;
    },
    resetFields: function () {
      this.selectedProvider = "";
      this.selectedBattery = "";
    },

    validateFields: function (provider, battery) {
      return !(provider === "" || battery === "");
    },
    getBatteriesByProvider: function () {
      this.assetIds = "";
      this.assetIdsVisible = false;
      this.listProviders.forEach(this.findProvider);
    },
    findProvider: function (item) {
      if (item.name == this.selectedProvider) this.provider = item;
      else return null;
    },
    getAssetIdsByBattery: function () {
      this.provider.batteries.forEach(this.findAssetId);
      this.assetIdsVisible = true;
      console.log(this.assetIds);
    },
    findAssetId: function (item) {
      let assetId = JSON.stringify(item.AssetIds);
      if (item.id == this.selectedBattery) this.assetIds = assetId;
      else return null;
    },
    async getBatteryDataUsingQRCode() {
      // To get the provider and batteries
      this.getBatteriesByProvider();
      this.getAssetIdsByBattery();
      await this.getProductPassport();
    },
    getProductPassport: function () {
      if (this.validateFields(this.selectedProvider, this.selectedBattery))
        this.$router.replace({
          name: "Passport",
          params: { assetIds: this.assetIds },
          query: {
            provider: this.selectedProvider,
            battery: this.selectedBattery,
          },
        });
      else alert("Battery provider and battery name are required...!");
    },
  },
};
</script>

<style scoped>
#battery-passport-root {
  min-height: 100vh;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10vh;
}

.success-btn {
  width: 340px;
  height: 48px;
  margin: 12px 0 60px 0;
  background: #b3cb2d;
  color: white;
  font-size: 16px;
  font-weight: bolder;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.success-btn:disabled {
  cursor: not-allowed;
  /* TODO add disabled color #b7c567*/
}

.label {
  padding: 12px 0 12px 0;
  font-weight: bold;
}

.select {
  width: 340px;
  height: 48px;
  border: solid 1px #b3cb2c;
  border-radius: 4px;
}

.dashboard-container {
  width: 64%;
  margin: 12em 18% 70px 18%;
}

.titles-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
}

.title {
  font-size: 32px;
  font-weight: bold;
}

.sub-title {
  font-size: 16px;
  font-weight: bold;
}

.orange {
  color: #ffa600;
}

@media (max-width: 750px) {
  .container {
    width: 80%;
    margin: 25% 10% 0 10%;
  }

  .success-btn {
    width: 90%;
    margin: 0;
  }

  .select {
    width: 90%;
  }
}
</style>
