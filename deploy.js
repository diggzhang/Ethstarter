const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledCampaignFactory = require('./build/CampaignFactory.json');

const mnemonic =
  'judge exhaust security crowd pattern crop roast open kingdom memory ask jar';
const networkUrl =
  'http://127.0.0.1:8545';

const provider = new HDWalletProvider(mnemonic, networkUrl);
const web3 = new Web3(provider);

var accounts, lottery;

const deploy = async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(
    JSON.parse(compiledCampaignFactory.interface)
  )
    .deploy({
      data: '0x' + compiledCampaignFactory.bytecode
    })
    .send({
      from: accounts[0],
      gas: '2000000'
    });

  console.log('Contract Deployed! Contract Address: ', lottery.options.address);
  //Latest Deployed Campaign Factory Address: 0xd3459F8b8089e991Da314E7137991f2D316B848d
};

deploy();
