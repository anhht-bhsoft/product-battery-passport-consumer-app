import { SERVER_URL } from "@/services/service.const";
import axios from "axios";

export default class Wrapper {

  // Step 1: Request contract offers from the catalog
  getContractOfferCatalog(providerUrl, requestHeaders) {
    return new Promise(resolve => {

      axios.get(`${SERVER_URL}/consumer/data/catalog?providerUrl=${providerUrl}`,
        {
          headers: requestHeaders
        }
      )
        .then((response) => {
          resolve(response.data);
        })
        .catch((e) => {
          console.error("getContractOfferCatalog -> " + e);
          resolve('rejected');
        });
    });
  }
  // Step 2: Negotiate a contract based on contract offer retrieved in previous step
  doContractNegotiation(payload, requestHeaders) {
    let requestBody = {
      "connectorId": payload.connectorId,
      "connectorAddress": payload.connectorAddress,
      "offer": {
        "offerId": payload.contractOffer.id,
        "assetId": payload.contractOffer.asset.id,
        "policy": {
          "uid": "null",
          "prohibitions": [],
          "obligations": [],
          "permissions": [
            {
              "edctype": "dataspaceconnector:permission",
              "action": {
                "type": "USE"
              },
              "target": payload.contractOffer.asset.id,
              "constraints": []
            }
          ]
        }
      }
    };

    return new Promise(resolve => {

      axios.post(`${SERVER_URL}/consumer/data/contractnegotiations`, requestBody, {
        headers: requestHeaders
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((e) => {
          console.error("doContractNegotiation -> " + e);
          resolve('rejected');
        });
    });
  }
  // Step 3: Get the contract agreement id to verify if the negotiation is aprroved or declined
  getAgreementId(uuid, requestHeaders) {
    return new Promise(resolve => {

      setTimeout(() => {
        axios.get(`${SERVER_URL}/consumer/data/contractnegotiations/${uuid}`, {
          headers: requestHeaders
        })
          .then((response) => {
            console.log('check_state : ' + response.data.state);
            console.log('Agreement Id: ' + response.data.contractAgreementId);
            console.log('Agreement state: ' + response.data.state);
            resolve(response.data);
          })
          .catch((e) => {
            console.error("getAgreementId -> " + e);
            alert(e);
            resolve('rejected');
          });
        ;
      }, 5000);

    });
  }
  // Step 4.1: Initiate data transfer process based on agreement id from previous step
  initiateTransfer(assetId, requestHeaders, payload) {

    let requestBody = {
      "id": payload.transferProcessId,
      "connectorId": payload.connectorId,
      "connectorAddress": payload.connectorAddress,
      "contractId": payload.contractAgreementId,
      "assetId": assetId,
      "managedResources": false,
      "dataDestination": {
        "type": payload.type
      },
    };
    return new Promise(resolve => {
      console.log(requestBody);
      axios.post(`${SERVER_URL}/consumer/data/transferprocess`, requestBody, {
        headers: requestHeaders
      })
        .then((response) => {
          console.log(response.data);
          resolve(response.data);
        })
        .catch((e) => {
          console.error("initiateTransfer -> " + e);
          resolve('rejected');
        });
    });
  }
  // Step 4.2: Verify data transfer status
  getTransferProcessById(transferId, requestHeaders) {

    return new Promise(resolve => {
      setTimeout(() => {
        axios.get(`${SERVER_URL}/consumer/data/transferprocess/${transferId}`, {
          headers: requestHeaders
        })
          .then((response) => {
            console.log(response.data);
            resolve(response.data);
          })
          .catch((e) => {
            console.error("getTransferProcessById -> " + e);
            resolve('rejected');
          });
      }, 5000);
    });
  }
  // Step 4.3: Query transferred data from consumer backend system
  getDataFromConsumerBackend(transferProcessId) {

    return new Promise(resolve => {

      setTimeout(() => {
        axios.get(`${SERVER_URL}/consumer_backend/${transferProcessId}`, {
          headers: {
            'Accept': 'application/octet-stream'
          }
        })
          .then((response) => {
            console.log(response.data);
            resolve(response.data);
          })
          .catch((e) => {
            console.error("getDataFromConsumerBackend -> " + e);
            resolve('rejected');
          });
        ;
      }, 5000);
    });
  }

  async performEDCDataTransfer(assetId, providerConnector, requestHeaders) {
    let contractId = "";
    let data = await this.getContractOfferCatalog(providerConnector.connectorAddress, requestHeaders);

    // Contarct catalog returns array of contract offers, select one that matches assetId //
    let contractOffer = data.contractOffers.filter(offer => {
      return offer.asset.id.includes(assetId);
    });

    // Contract negotiation request parameters //
    let payload = {
      connectorAddress: providerConnector.connectorAddress,
      connectorId: providerConnector.idShort,
      contractOffer: contractOffer[0]
    };
    console.log(payload);
    let negotiation = await this.doContractNegotiation(payload, requestHeaders);
    console.log("Negotiation ID: " + negotiation.id);


    // Check agreement status //
    // Status: INITIAL, REQUESTED, CONFIRMED
    let response = null;
    // Check the agreement status until it is of status CONFIRMED
    while (response == null || response.state != "CONFIRMED") {
      response = await this.getAgreementId(negotiation.id, requestHeaders);
      console.log("Agreement state:  ", response.state + '_' + response.contractAgreementId);
      contractId = response.contractAgreementId;
    }

    // initiate data transfer
    const transferRequest = {
      transferProcessId: Date.now(),
      connectorId: providerConnector.idShort,
      connectorAddress: providerConnector.connectorAddress,
      contractAgreementId: contractId,
      assetId: assetId,
      type: "HttpProxy"
    };
    let transfer = await this.initiateTransfer(assetId, requestHeaders, transferRequest);
    console.log("Transfer Id: " + transfer.id);

    let result = null;
    // Check the transfer status repeatedly until it is COMPLETED from consumer side
    while (result == null || result.state != "COMPLETED") {

      result = await this.getTransferProcessById(transfer.id, requestHeaders[1]);
      console.log("Transfer state:  ", result.type + '_' + result.state[0]);
    }
    contractId = "123";
    return await [this.getDataFromConsumerBackend(transferRequest.transferProcessId), contractId, negotiation];
  }
}
