import web3 from './web3';
import compiledCampaignFactory from './build/CampaignFactory.json';

const campaignFactory = new web3.eth.Contract(
  JSON.parse(compiledCampaignFactory.interface),
  '0x728D0B8E573aAd130109BdC2Ef39384eCBBfd450'
);

export default campaignFactory;
