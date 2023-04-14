
import { makeAutoObservable, runInAction } from "mobx"
import { Ttlock, TtGateway, TtRemoteDeivce, ScanLockModal, ScanGatewayModal, ScanWifiModal, ScanRemoteDeviceModal } from 'react-native-ttlock';


class Store {
  constructor() {
    makeAutoObservable(this)
  }


  lockList: ScanLockModal[] = []

  gatewayList: ScanGatewayModal[] = []

  wifiList: ScanWifiModal[] = []

  remoteDeviceList: ScanRemoteDeviceModal[] = []


  startScanLock() {
    runInAction(() => {
      this.lockList = [];
    });

    Ttlock.startScan((scanLockModal: ScanLockModal) => {
      let isContainModal = false;
      let isInitStateChanged = false;

      runInAction(() => {
        this.lockList.forEach((oldScanLockModal: ScanLockModal) => {
          if (oldScanLockModal.lockMac === scanLockModal.lockMac) {
            isContainModal = true;
            if (oldScanLockModal.isInited !== scanLockModal.isInited) {
              oldScanLockModal.isInited = scanLockModal.isInited;
              isInitStateChanged = true;
            }
          }
        });
        if (isContainModal === false) {
          this.lockList.push(scanLockModal)
        }

        if (isContainModal === false || isInitStateChanged) {
          this.lockList.sort((modal1, modal2) => {
            let value1 = modal1.isInited ? 1 : 0;
            let value2 = modal2.isInited ? 1 : 0;
            return value1 - value2;
          })
          this.lockList = this.lockList.concat([]);
        }
      });
    });
  }

  startScanGateway() {
    runInAction(() => {
      this.gatewayList = [];
    });
    TtGateway.startScan((data) => {
      let isContainData = false;
      runInAction(() => {
        this.gatewayList.forEach((oldData) => {
          if (oldData.gatewayMac === data.gatewayMac) {
            isContainData = true;
          }
        });
        if (isContainData === false) {
          this.gatewayList.push(data);
          this.gatewayList = this.gatewayList.slice();
        }
      });
    });
  }

  startScanWifi(finished:()=>void) {
   
    TtGateway.getNearbyWifi((list) => {
      var wifiList1 = [...this.wifiList];
      wifiList1.push(...list);
      // 根据 wifi 去重
     var wifiList2 = [...new Set(wifiList1.map(item => item.wifi))].map(wifi => wifiList1.find(item => item.wifi === wifi)); 
     // 根据 rssi 升序排序
     var wifiList3 = wifiList2.sort((a, b) => a!.rssi - b!.rssi); 

     var wifiList4: ScanWifiModal[] = []
     for (let i = 0; i < wifiList3.length; i++) {
      if (wifiList3[i] === undefined) {
      }else{
        wifiList4.push(wifiList3[i]!)
      }
    }
     this.wifiList = wifiList4;
     

      
      console.log('wifi搜索：' + JSON.stringify(list));
    }, () => {
      finished();
    }, null)
  }

  startScanRemoteDevice() {
    runInAction(() => {
      this.gatewayList = [];
    });

    TtRemoteDeivce.startScan((sancModel)=>{
      let isContainData = false;
      runInAction(() => {
        this.remoteDeviceList.forEach((oldData) => {
          if (oldData.remoteDeviceMac === sancModel.remoteDeviceMac) {
            isContainData = true;
          }
        });
        if (isContainData === false) {
          this.remoteDeviceList.push(sancModel);
          this.remoteDeviceList = this.remoteDeviceList.slice();
        }
      });
    })
  }


}

export default new Store()
