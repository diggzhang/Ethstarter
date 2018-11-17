import React, { Component } from 'react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import { Link } from 'react-router-dom';

class CreateCampaign extends Component {
  state = {
    minimumContribution: '',
    campaignName: '',
    errorMessage: '',
    loading: false,
    created: false,
    campaign_address: ''
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      errorMessage: '',
      created: false,
      campaign_address: '',
      loading: true
    });

    try {
      if (this.state.minimumContribution === 0) {
        throw Error('请输入最小贡献金额');
      }

      if (!this.state.campaignName) {
        throw Error('请输入众筹名称');
      }

      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution, this.state.campaignName)
        .send({
          from: accounts[0]
        });

      const campaign_address = await factory.methods.recentCampaign().call();
      this.setState({
        created: true,
        loading: false,
        campaign_address
      });
    } catch (err) {
      if (
        err.message ===
        '没有from地址！'
      ) {
        err.message =
          '请检查是否签入metamask!';
      }
      this.setState({ errorMessage: err.message, loading: false });
    }
  };

  render() {
    let errorAlert = null;
    let successAlert = null;

    if (this.state.errorMessage) {
      errorAlert = (
        <div
          className="alert alert-danger mt-4 z-depth-2 text-center animated fadeIn"
          role="alert"
        >
          <strong>错误: </strong>
          {this.state.errorMessage}
        </div>
      );
    }

    if (this.state.created) {
      successAlert = (
        <div
          className="alert alert-success mt-4 z-depth-2 clearfix mb-5 text-center animated fadeIn"
          style={{ fontSize: '20px' }}
          role="alert"
        >
          恭喜！你的众筹已创建成功。 
          <br />
          区块链地址是:
          <strong className="ml-2" style={{ fontSize: '24px' }}>
            {this.state.campaign_address}
          </strong>
          <Link to={'campaigns/' + this.state.campaign_address}>
            <button type="button" className="btn btn-success float-right mt-3">
              查看众筹
            </button>
          </Link>
        </div>
      );
    }

    const breadcrum = (
      <nav className="breadcrumb bg-white">
        <Link to="/" className="breadcrumb-item">
         葱众筹 
        </Link>

        <span className="breadcrumb-item active">创建</span>
      </nav>
    );

    return (
      <div className="container mt-5 mb-5 animated fadeIn">
        {breadcrum}
        <div className="ml-3">
          <h1 className="mt-3">创建葱众筹</h1>

          <form onSubmit={this.onSubmit}>
            <div className="md-form m t-5">
              <h4>最小贡献</h4>
              <h6>
              个人为了成为一个赞助者而必须做出的贡献
              </h6>
              <input
                type="text"
                placeholder="以OC为单位输入金额"
                id="form1"
                className="form-control form-control-lg mt-4"
                value={this.state.minimumContribution}
                onChange={event =>
                  this.setState({ minimumContribution: event.target.value })
                }
              />
              <input
                type="text"
                placeholder="众筹名字"
                id="form1"
                className="form-control form-control-lg mt-4"
                value={this.state.campaignName}
                onChange={event =>
                  this.setState({ campaignName: event.target.value })
                }
              />
              {this.state.loading ? (
                <div>
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary mt-4 animated fadeIn"
                    disabled
                  >
                    <i className="fa fa-refresh fa-spin mr-3"> </i>
                    创建...
                  </button>{' '}
                  <span style={{ fontSize: '20px' }} className="ml-3">
                    稍等！正在部署你的众筹到区块链中。。。
                  </span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="btn btn-lg btn-primary mt-4 animated fadeIn"
                >
                  创建 !
                </button>
              )}
              {errorAlert} {successAlert}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateCampaign;
