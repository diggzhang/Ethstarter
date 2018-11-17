import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import CreateCampaign from './CreateCampaign';
import CampaignShowcase from './CampaignShowcase';
import { Jumbotron } from './ui-components/mdb-stateless-components';

class Landing extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Jumbotron
          title="葱爆定制: 为了乐趣而生!"
          buttonText="发起葱定制"
        >
          葱爆定制是一个去中心化的协作平台，将创作者、需求者聚到一起构建有趣的社区。
          <br /> 在葱爆定制，你可以发布自己的需求：一道看不懂的题目、一节想听的葱味课等等。贡献你的洋葱币，吸引创作者为你独家定制。
          一切都是去中心化的接受社区监督，人人都参与者. 
          <br />
          {' '}
          <strong>#洋葱智能合约</strong>
        </Jumbotron>
        <Switch>
          <Route path="/create-campaign" exact component={CreateCampaign} />
          <Route path="/" exact component={CampaignShowcase} />
        </Switch>
      </div>
    );
  }
}

export default Landing;
