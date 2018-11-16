const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

const Web3 = require('web3');
const compiledCampaignFactory = require('./build/CampaignFactory.json');

const mnemonic =
  'judge exhaust security crowd pattern crop roast open kingdom memory ask jar';
const privateKey =
  '0x69a6eb5983cb8d3cf6f8461bf8ff613ada0421a398437dd4e62e62aa51a557f8';

const privKeys = ['69a6eb5983cb8d3cf6f8461bf8ff613ada0421a398437dd4e62e62aa51a557f8']; // private keys

const networkUrl =
  'http://10.8.8.63:8545';

const provider = new HDWalletProvider(privKeys, networkUrl);
const web3 = new Web3(provider);

web3.eth.net.getNetworkType().then(console.log);

var accounts, lottery;

const deploy = async () => {
  accounts = await web3.eth.getAccounts();
  console.log(accounts)

  lottery = await new web3.eth.Contract(
    JSON.parse(compiledCampaignFactory.interface)
  )
    .deploy({
      data: '0x' + compiledCampaignFactory.bytecode
    })
    .send({
      from: accounts[0],
      gas: '10000000',
      chainId: 456719 
    });

  console.log('Contract Deployed! Contract Address: ', lottery.options.address);
  //Latest Deployed Campaign Factory Address: 0xd3459F8b8089e991Da314E7137991f2D316B848d
};

deploy();

