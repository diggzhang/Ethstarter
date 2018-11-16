import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class CampaignRequests extends Component {
  state = {
    requests: [],
    backers: '',
    errorMessage: '',
    approvalLoading: false,
    approved: false,
    finalizeLoading: false,
    finalized: false,
    processingIndex: null
  };

  campaign;

  componentDidMount() {
    this.fetchRequests();
  }

  fetchRequests = async () => {
    this.campaign = Campaign(this.props.match.params.id);
    const requestsCount = await this.campaign.methods.getRequestsCount().call();
    const backersCount = await this.campaign.methods.backersCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestsCount, 10))
        .fill()
        .map((element, index) => {
          return this.campaign.methods.requests(index).call();
        })
    );
    this.setState({
      requests,
      backers: backersCount
    });
  };

  onApprove = async index => {
    this.setState({
      approvalLoading: true,
      errorMessage: '',
      approved: false,
      processingIndex: index
    });

    const accounts = await web3.eth.getAccounts();
    try {
      await this.campaign.methods.approveRequest(index).send({
        from: accounts[0]
      });

      setTimeout(() => {
        this.fetchRequests();
        this.setState({
          approved: true,
          approvalLoading: false,
          processingIndex: null
        });
      }, 2000);
    } catch (err) {
      if (
        err.message ===
        '没有from地址！'
      ) {
        err.message =
        '请检查是否签入metamask!'
      }
      this.setState({
        errorMessage: err.message,
        approvalLoading: false,
        processingIndex: null
      });
    }
  };

  onFinalize = async index => {
    this.setState({
      finalizeLoading: true,
      errorMessage: '',
      finalized: false,
      processingIndex: index
    });

    const accounts = await web3.eth.getAccounts();
    try {
      await this.campaign.methods.finalizeRequest(index).send({
        from: accounts[0]
      });

      setTimeout(() => {
        this.fetchRequests();
        this.setState({
          finalized: true,
          finalizeLoading: false,
          processingIndex: null
        });
      }, 2000);
    } catch (err) {
      if (
        err.message ===
        'No "from" address specified in neither the given options, nor the default options.'
      ) {
        err.message =
          'Metamask (operating over Rinkeby n/w) is required to finalize! Please check if you are signed into metamask.';
      }
      this.setState({
        errorMessage: err.message,
        finalizeLoading: false,
        processingIndex: null
      });
    }
  };

  renderRow = () => {
    return this.state.requests.map((request, index) => {
      return (
        <tr key={index} className="animated fadeIn">
          <th scope="row">{index}</th>
          <td>{request.description}</td>
          <td>{web3.utils.fromWei(request.value, 'ether')}</td>
          <td>{request.recipient}</td>
          <td>
            {request.approvalCount}/{this.state.backers}
          </td>
          <td>
            {request.complete ? null : this.state.approvalLoading &&
            this.state.processingIndex == index ? (
              <button className="btn btn-primary btn-sm disabled animated fadeIn">
                <i className="fa fa-refresh fa-spin mr-3"> </i>
                申请确认中
              </button>
            ) : (
              <button
                className="btn btn-primary animated fadeIn"
                onClick={() => this.onApprove(index)}
              >
                准奏
              </button>
            )}
          </td>
          <td>
            {request.complete ? (
              <button className="btn btn-mdb-color btn disabled animated fadeIn">
                已发！
              </button>
            ) : this.state.finalizeLoading &&
            this.state.processingIndex == index ? (
              <button className="btn btn-mdb-color btn-sm disabled animated fadeIn">
                <i className="fa fa-refresh fa-spin mr-3"> </i>
                确定中
              </button>
            ) : (
              <button
                className="btn btn-mdb-color animated fadeIn"
                onClick={() => this.onFinalize(index)}
              >
                发工资
              </button>
            )}
          </td>
        </tr>
      );
    });
  };

  renderTable = () => {
    return (
      <table className="table table-hover text-center">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">申请理由</th>
            <th scope="col">提币金额(OC)</th>
            <th scope="col">接收人</th>
            <th scope="col">投资人确认次数</th>
            <th scope="col">#限投资者</th>
            <th scope="col">#限管理员t</th>
          </tr>
        </thead>
        <tbody>{this.renderRow()}</tbody>
      </table>
    );
  };

  render() {
    let errorAlert = null;
    let approvedAlert = null;
    let finalizedAlert = null;

    if (this.state.errorMessage) {
      errorAlert = (
        <div
          className="alert alert-danger mt-4 z-depth-2 text-center animated fadeIn"
          role="alert"
        >
          <strong>Error:</strong> {this.state.errorMessage}
        </div>
      );
    }

    if (this.state.approved) {
      approvedAlert = (
        <div
          className="alert alert-success mt-4 z-depth-2 clearfix text-center animated fadeIn"
          style={{ fontSize: '20px' }}
          role="alert"
        >
          You have successfully approved the request!
        </div>
      );
    }

    if (this.state.finalized) {
      finalizedAlert = (
        <div
          className="alert alert-success mt-4 z-depth-2 clearfix text-center animated fadeIn"
          style={{ fontSize: '20px' }}
          role="alert"
        >
          Request is successfully finalized and the payment is transfered to the
          recipient.
        </div>
      );
    }

    const breadcrum = (
      <nav className="breadcrumb bg-white">
        <Link to="/" className="breadcrumb-item">
          葱众筹
        </Link>
        <Link
          to={`/campaigns/${this.props.match.params.id}`}
          className="breadcrumb-item"
        >
          众筹详情
        </Link>
        <span className="breadcrumb-item active">经费申请</span>
      </nav>
    );

    return (
      <div className="container animated fadeIn mt-5">
        {breadcrum}
        <div className="clearfix">
          <Link to={this.props.match.url + '/create-request'}>
            <button className="btn btn-info float-right">发起申请</button>
          </Link>
        </div>
        <div className="mt-5">{this.renderTable()}</div>
        <div style={{ marginTop: '75px' }}>
          {errorAlert} {approvedAlert} {finalizedAlert}
        </div>
      </div>
    );
  }
}

export default CampaignRequests;
