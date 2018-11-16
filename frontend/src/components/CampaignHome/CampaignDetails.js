import React, { Component } from 'react';
import web3 from '../../ethereum/web3';
import Campaign from '../../ethereum/campaign';
import { Link } from 'react-router-dom';
import { DetailCard } from '../ui-components/mdb-stateless-components';

class CampaignDetails extends Component {
  state = {
    summary: null,
    value: '',
    loading: false,
    errorMessage: '',
    contributed: false
  };

  campaign;

  componentDidMount() {
    this.fetchSummary();
  }

  fetchSummary = async () => {
    this.campaign = Campaign(this.props.match.params.id);
    let summary = await this.campaign.methods.getSummary().call();
    //though the above summary var looks like an array, however, it's an object with keys beint 0,1...

    summary = {
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      backersCount: summary[3],
      manager: summary[4]
    };

    this.setState({ summary: summary });
  };

  renderDetails() {
    const items = [
      {
        title: web3.utils.fromWei(this.state.summary.balance, 'ether'),
        meta: '余额 (OC)',
        description:
          '目前众筹池所剩余额'
      },
      {
        title: this.state.summary.minimumContribution,
        meta: '最小投资 (OC)',
        description:
          '至少投资这么多，才能成为该项目投资人哦'
      },
      {
        title: this.state.summary.backersCount,
        meta: '投资人',
        description:
          '该项目已经投币的金主们'
      },
      {
        title: this.state.summary.requestCount,
        meta: '经费申请',
        description:
          "请求从该活动智能合约中提取资金。需要得到投资者的批准。"
      }
    ];

    return items.map(item => {
      return (
        <DetailCard
          title={item.title}
          meta={item.meta}
          description={item.description}
          key={item.meta}
        />
      );
    });
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({
      errorMessage: '',
      contributed: false,
      loading: true
    });

    try {
      if (
        parseInt(web3.utils.toWei(this.state.value, 'ether'), 10) <
        parseInt(this.state.summary.minimumContribution, 10)
      ) {
        throw Error(
          "如果想成为金主，至少投资本项目的最低限额"
        );
      }

      const accounts = await web3.eth.getAccounts();
      await this.campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      setTimeout(() => {
        this.fetchSummary();
        this.setState({ contributed: true, loading: false });
      }, 2000);
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
          <strong>错误:</strong> {this.state.errorMessage}
        </div>
      );
    }

    if (this.state.contributed) {
      successAlert = (
        <div
          className="alert alert-success mt-4 z-depth-2 clearfix text-center animated fadeIn"
          style={{ fontSize: '20px' }}
          role="alert"
        >
          恭喜！你已经成为本项目的投资人 <br />
          <strong style={{ fontSize: '25px' }}>金主大大. </strong>
          有资格参与项目资金申请的审核。
        </div>
      );
    }

    const form = (
      <form onSubmit={this.onSubmit}>
        <div className="md-form">
          <h4>投币支持</h4>
          <input
            type="text"
            id="form1"
            className="form-control form-control-lg mt-4 w-25 m-auto text-center"
            placeholder="洋葱币数"
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
          />
          {this.state.loading ? (
            <div>
              <button
                className="btn btn-lg btn-primary mt-4 animated fadeIn"
                disabled
              >
                <i className="fa fa-refresh fa-spin mr-3"> </i>
                投币中...
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="btn btn-lg btn-primary mt-4 animated fadeIn"
            >
              赏！
            </button>
          )}
        </div>
      </form>
    );

    const breadcrum = (
      <nav className="breadcrumb bg-white">
        <Link to="/" className="breadcrumb-item">
          葱众筹
        </Link>

        <span className="breadcrumb-item active">众筹活动细节</span>
      </nav>
    );

    if (this.state.summary) {
      return (
        <div className="container animated fadeIn mb-5">
          {breadcrum}
          <div className="text-center">{form}</div>
          {errorAlert}
          {successAlert}
          <div className="row">{this.renderDetails()}</div>
          <div className="text-center mt-5">
            <Link to={`${this.props.match.url}/requests`}>
              <button className="btn btn-lg btn-info w-50">
              查看经费申请
              </button>
            </Link>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default CampaignDetails;
