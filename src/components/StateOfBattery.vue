<template v-if="stateOfBattery.batteryIdentification">
  <SectionHeader title="5. State of battery" @click="toggle = !toggle" />
  <div class="section-content" :class="[toggle ? 'hidden' : '']">
    <div class="sub-section-container">
      <Field
        data-cy="state-of-charge"
        label="State of health"
        :value="stateOfBattery.stateOfBattery.stateOfHealth"
      />
      <Field
        label="Status battery"
        :value="stateOfBattery.stateOfBattery.statusBattery"
      />
      <Field
        label="State of charge"
        :value="stateOfBattery.stateOfBattery.stateOfCharge"
      />
      <Field
        label="Cycle life test c rate"
        :value="stateOfBattery.batteryCycleLife.cycleLifeTestCRate"
      />
      <Field
        label="Cycle life test depth of discharge"
        :value="stateOfBattery.batteryCycleLife.cycleLifeTestDepthOfDischarge"
      />
      <Field
        label="Expected lifetime"
        :value="stateOfBattery.batteryCycleLife.expectedLifetime"
      />
      <Field
        label="Temperature range idle state upper limit"
        :value="
          stateOfBattery.temperatureRangeIdleState
            .temperatureRangeIdleStateUpperLimit
        "
      />
      <Field
        label="Temperature range idle state lower limit"
        :value="
          stateOfBattery.temperatureRangeIdleState
            .temperatureRangeIdleStateLowerLimit
        "
      />
    </div>
  </div>
</template>

<script>
import SectionHeader from "./SectionHeader.vue";
import Field from "./Field.vue";

export default {
  name: "StateOfBattery",
  components: {
    Field,
    SectionHeader,
  },
  props: {
    sectionTitle: {
      type: String,
      required: false,
      default: "",
    },
    stateOfBattery: {
      type: Object,
      default: Object,
    },
  },

  data() {
    return {
      toggle: false,
    };
  },
};
</script>

<style scoped>
.full-width {
  width: 100% !important;
}

.sub-section-container {
  display: flex;
  flex-wrap: wrap;
  border-bottom: solid 1px #edefe5;
}

.two-third-width {
  width: 66% !important;
}

.section-content {
  width: 100%;
  border: solid 1px #b3cb2d;
  border-radius: 0 0 4px 4px;
  background-color: #fff;
  margin-bottom: 50px;
}

.hidden {
  display: none;
}

.longer {
  padding-bottom: 50px;
}

@media (max-width: 750px) {
  .section-content {
    border: none;
  }

  .section-content {
    margin-bottom: 0;
  }

  .longer {
    padding-bottom: 0;
  }
}
</style>
