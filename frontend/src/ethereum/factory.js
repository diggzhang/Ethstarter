import web3 from './web3';
import compiledCampaignFactory from './build/CampaignFactory.json';

const campaignFactory = new web3.eth.Contract(
  JSON.parse(compiledCampaignFactory.interface),
  '0xfA2266d60a5B555cc3B5CeF8da05CDbb9AB5FA92'
);

export default campaignFactory;
