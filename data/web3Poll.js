var Web3 = require('web3');
var axios = require('axios');
var AsyncPolling = require('async-polling');
var abiArray = require("./contract-data");
var config = require("../config")

var web3 = new Web3(new Web3.providers.HttpProvider(config.ropstenInfura));

async function getWager(){
    try {
        result = await axios.get("http://localhost:5000/pendingtxs");
    } catch (error) {
        console.log(error);
    }

    for(let i = 0 ; i < result.data.length; i++){
        const txhash = result.data[i].txhash;
        try {
            const receipt = await web3.eth.getTransactionReceipt(txhash);
            
            if(!receipt){
                continue;
            }
    
            if(receipt.status === "0x0"){
                continue;
            }
    
            axios.put(`http://localhost:5000/pending/${txhash}`, {
                contractAddress: receipt.contractAddress || receipt.to,
                txhash: null,
                pendingUser: null,
                pending: false
            })
            .catch((error) => { console.log(error) });

        } catch (error){
            console.log(error);
        }

    }
}

async function deleteCanceledContract(){
    try {
        const result = await axios.get("http://localhost:5000/openbets");

        for(let i = 0 ; i < result.data.length; i++){
            const contractAddress = result.data[i].contractAddress;
            const contract = new web3.eth.Contract(abiArray, contractAddress);
            contract.getPastEvents("contractState",{    
                fromBlock: 0,
                toBlock: 'latest'})
            .then(async (events) => {
                // console.log(events[events.length-1].returnValues.state)
                if(events[events.length-1].returnValues.state === "Canceled"){
                    axios.delete("http://localhost:5000/deletebet", {params: { contractAddress }})
                    .catch((error) => {
                        console.log(error);
                    })
                }
            })
            .catch((error) => { console.log(error) })
        }

    } catch(error) {
        console.log(error);
    }

}

const getActiveContracts = async () => {
    try {
        const result = await axios.get("http://localhost:5000/openbets");
        
        for(let i = 0 ; i < result.data.length; i++){
            const contractAddress = result.data[i].contractAddress;
            const contract = new web3.eth.Contract(abiArray, contractAddress);
            const events = await contract.getPastEvents("contractState",{    
                fromBlock: 0,
                toBlock: 'latest'})
        
            if(events[events.length-1].returnValues.state === "Canceled"){
                continue
            }
            
            const betActive= await contract.methods.betActive().call();
            const acceptedBy = await contract.methods.player2().call()

            if(betActive === true && !result.data[i].betActive){
                axios.put("http://localhost:5000/contract", {    
                    contractAddress,
                    acceptedBy               
                })
                .then((response) => {  })
                .catch((error) => { console.log(error) })
                
            }
        }

    } catch (error) {
        console.log(error);
    }
}


// ********* Polls ever 3 Sec
AsyncPolling(function (end) { 
    getWager();
    getActiveContracts()
    deleteCanceledContract();
    end();
  }, 3000).run();
