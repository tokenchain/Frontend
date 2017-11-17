import React from 'react';
import { Link } from 'react-router-dom';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeaderWithoutSort from '../generic/SearchHeaderWithoutSort';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import { UncontrolledTooltip } from 'reactstrap';
import './Contracts.css';
import { CONTRACT_STATE_FINISHED, CONTRACT_STATE_VERIFIED, CONTRACT_STATE_HALTED } from '../constants';



class Contracts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {ownedTabIndex: 0, completedTabIndex: 0};
    this.onOwnershipTabChange = this.onOwnershipTabChange.bind(this);
    this.onStatusTabChange = this.onStatusTabChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.selectedContract) {
      return;
    }
    if(nextProps.selectedContract !== this.props.selectedContract) {
      const requiredTab = (nextProps.selectedContract.state === CONTRACT_STATE_FINISHED & 1);
      if(this.state.completedTabIndex !== requiredTab) {
        this.setState({completedTabIndex: requiredTab});
      }
    }
  }

  onOwnershipTabChange(index) {
    this.setState({ownedTabIndex: index});
  }
  onStatusTabChange(index) {
    this.setState({completedTabIndex: index});
  }

  renderContent() {
    const data = this.state.completedTabIndex ?
      this.props.contracts.finished :
      this.props.contracts.current;
    return (
      <div>
        <Desktop>
          <ReactTable
            style={{'height': 345}}
            columns={this.getTableColumns()}
            data={data}
            selectedItem={this.props.selectedContract}
            onItemSelected={this.props.onContractSelected}
            scrollBarHeight={257}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            columns={this.getTableMobileColumns()}
            data={data}
            selectedItem={this.props.selectedContract}
            onItemSelected={this.props.onContractSelected}
            minRows={5}
            showPagination={true}
            defaultPageSize={5}
            PaginationComponent={Pagination}
          />
        </Mobile>
      </div>
    );
  }
  render() {
    return (
      <div className="table contracts_table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">Contracts</div>
          <SegmentedControl selectedIndex={this.state.completedTabIndex} segments={['CURRENT', 'FINISHED']} onChange={this.onStatusTabChange}/>
        </div>
        {this.renderContent()}
      </div>
    );
  }

  getTableColumns() {
    return [{
      Header: SearchHeaderWithoutSort('Contractor', '', () => {}),
      headerClassName: 'contractor',
      className: 'table_col_value',
      accessor: 'contractor',
      minWidth: 70,
      Cell: row => (<div className="contractor_link">@<Link className="table_col_value_a" to={'/' + row.value}>{row.value}</Link></div>),
    }, {
      Header: ContractTableHeader('Expire date'),
      id: 'expireDate',
      accessor: c => {
        return formatTime(c.expireDate - Date.now());
      },
      headerClassName: 'expire_date big_column',
      className: 'table_col_value big_column',
      minWidth: 60,
      className: 'table_col_value',
      headerClassName: 'expire_date',
    }, {
      Header: ContractTableHeader('Current\nprofit, %'),
      id: 'currentProfit',
      className: 'table_col_value',
      headerClassName: 'current_profit',
      accessor: c => ((c.currentBalance / c.startBalance - 1) * 100).toFixed(2),
      minWidth: 50,
      Cell: NegativeValuesCell
    }, {
      Header: ContractTableHeader('Max\nloss, %'),
      className: 'table_col_value',
      headerClassName: 'max_loss',
      minWidth: 50,
      accessor: 'maxLoss',
    }, {
      id: 'startBalance',
      className: 'table_col_value',
      headerClassName: 'start_balance',
      Header: ContractTableHeader('Start\nbalance, %'),
      minWidth: 50,
      accessor: c => c.startBalance + ' ' + c.currency,
    }, {
      id: 'currentBalance',
      headerClassName: 'current_balance small_column',
      className: 'table_col_value small_column',
      Header: ContractTableHeader('Current\nbalance, %'),
      minWidth: 50,
      accessor: c => c.currentBalance + ' ' + c.currency,
    }, {
      id: 'left',
      Header: ContractTableHeader('Left'),
      headerClassName: 'left_column small_column',
      className: 'table_col_value',
      minWidth: 40,
      accessor: c => c.left + ' ' + c.currency,
    }, {
      Header: ContractTableHeader('Fee, %'),
      minWidth: 30,
      headerClassName: 'fee_column small_column',
      className: 'table_col_value small_column',
      accessor: 'fee'
    }, {
      Header: <TXHeader />,
      Cell: TXCell,
      minWidth: 30,
      sortable: false,
      headerClassName: 'tx_column small_column',
      className: 'small_column tx_column'
    }, {
      Header: HelpHeader('Status'),
      accessor: 'state',
      minWidth: 50,
      Cell: StatusCell,
      headerClassName: 'status_column small_column',
      className: 'small_column'
    }];
  }

  getTableMobileColumns() {
    return [{
      Header: SearchHeaderWithoutSort('Contractor', '', () => {}),
      headerClassName: 'contractor big_column',
      className: 'big_column table_col_value',
      accessor: 'contractor',
      minWidth: 84,
      Cell: row => (<div className="contractor_link">@<Link className="table_col_value_a" to={'/' + row.value}>{row.value}</Link></div>),
    }, {
      id: 'currentBalance',
      headerClassName: 'current_balance small_column',
      className: 'table_col_value small_column',
      minWidth: 82,
      Header: ContractTableHeader('Current\nbalance, %'),
      accessor: c => c.currentBalance + ' ' + c.currency,
    }, {
      Header: ContractTableHeader('Fee, %'),
      headerClassName: 'fee_column small_column',
      className: 'table_col_value small_column',
      minWidth: 63,
      accessor: 'fee'
    }, {
      Header: HelpHeader('Status'),
      accessor: 'state',
      Cell: StatusCell,
      minWidth: 44,
      headerClassName: 'status_column small_column',
      className: 'small_column'
    }, {
      Header: <TXHeader />,
      Cell: TXCell,
      sortable: false,
      minWidth: 45,
      headerClassName: 'tx_column small_column',
      className: 'small_column tx_column'
    }];

  }
}

const HelpHeader = header => {
  return (
    <div className="table_header_wrapper contract_header_wrapper">
      <div className="table_header">{header}</div>
      <ContractStatusHelp />
      <div className="sort_icon_wrapper">
        <div className="green_arrow"></div>
      </div>
    </div>
  );
};

const ContractStatusHelp = () => (
  <div id="help-icon-contract-status" className="table_header_help_wrapper" style={{paddingTop: 22}}>
    <UncontrolledTooltip target="help-icon-contract-status" placement="auto-start">
      <div className="status_desc_item">
        <div className="status_desc_item_cyrcle green"></div>
        <div className="status_desc_item_text">completed</div>
      </div>
      <div className="status_desc_item">
        <div className="status_desc_item_cyrcle yellow"></div>
        <div className="status_desc_item_text">in progress</div>
      </div>
      <div className="status_desc_item">
        <div className="status_desc_item_cyrcle red"></div>
        <div className="status_desc_item_text">failed</div>
      </div>
    </UncontrolledTooltip>
  </div>
);

const TXHeader = () => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">TX</div>
    <div id="help-icon-tx" className="table_header_help_wrapper" style={{paddingTop: 22}}/>
    <UncontrolledTooltip target="help-icon-tx">
      This is a link on etherscan.io which contains all details of your contract
    </UncontrolledTooltip>
  </div>
);

const ContractTableHeader = header => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">{header}</div>
    <div className="sort_icon_wrapper">
      <div className="green_arrow"></div>
    </div>
  </div>
);
const NegativeValuesCell = row => (
  <div className={parseFloat(row.value) < 0 ? 'table_value_red' : 'table_value_green'}>{row.value}</div>
);

const TXCell = ({original}) => (
  <Link className="tx_link" to={original.txLink || 'https://etherscan.io'} />
);

const StatusCell = ({value}) => {
  let className = 'status_circle ';
  switch(value) {
    case CONTRACT_STATE_FINISHED:
      className += 'green';
      break;
    case CONTRACT_STATE_VERIFIED:
      className += 'yellow';
      break;
    case CONTRACT_STATE_HALTED:
      className += 'red';
      break;
    default:
      break;
  }
  return (
    <div className={className}></div>
  );
};

export default Contracts;
function formatTime(difference){
  const hours = Math.floor(difference / 1000 / 3600);
  const minutes = Math.floor(difference / 1000 % 3600 / 60);
  return `${hours} h ${minutes} m`;
}
