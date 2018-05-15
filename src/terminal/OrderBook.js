import React from 'react';
import { formatFloat, defaultFormatValue } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../generic/terminalSortFunctions';
import classNames from 'classnames';
import $ from 'jquery';

class OrderBook extends React.Component {

  constructor(props) {
    super(props);
    this.sortData = sortData.bind(this);
    this.reset = this.reset.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.fireOnScroll = this.fireOnScroll.bind(this);
    this.sortFunctions = {
      price: (a, b) => a.Rate - b.Rate,
      relativeSize: (a, b) => a.Rate * a.Quantity - b.Rate * b.Quantity,
    };
    this.state = {last: null, sort: {}, prelast: null, scroll: false};
  }

  onOrderClick(type, e) {
    e.stopPropagation();
    const target = e.currentTarget;
    this.props.onOrderSelect(parseFloat(target.dataset.price), target.dataset.size, type);
  }

  reset() {
    this.setState({scroll: false, sort: {}});
  }

  fireOnScroll() {
    if (this.props.orderBook.sell.length > 0) {
      this.setState({scroll: true});
      this.tableSell.removeEventListener('scroll', this.fireOnScroll);
    }
  }

  componentDidMount() {
    let processScrollableTable = function($table) {
      $table.on('reflowed', function(e, $floatContainer) {
        let headHeight = $('tr', this).first().height();

        $floatContainer.parent('.floatThead-wrapper').css({'padding-top': headHeight});
        $(this).css('margin-top', -headHeight);
      });
      $table.floatThead({
        scrollContainer: function($table){
          let $container = $table.parents('.js-table-wrapper');
          if (!$container.length) {
            $container = $table.parents('.js-dropdown-table-wrapper');
          }

          return $container;
        },
        position: 'absolute',
        autoReflow: 'true',
        width: '100px',
        debug: true
      });
    };
    $('.orderbook-table .js-table-wrapper table').each(function(index, el) {
      let $table = $(el);
      processScrollableTable($table);
    });
    $('.js-table-wrapper table').floatThead('reflow');
    this.tableSell.addEventListener('scroll', this.fireOnScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.market !== this.props.market) {
      if (this.state.scroll) {
        this.tableSell.addEventListener('scroll', this.fireOnScroll);
      }
      this.setState({scroll: false, sort: {}});
    }
    if(this.tableSell && this.tableSell.scrollTop === 0 && !this.state.scroll && (!this.state.sort.column)) {
      this.tableSell.scrollTop = this.tableSell.scrollHeight - 26.6;
    } else if(prevState.sort !== this.state.sort && this.tableSell) {
      this.tableSell.scrollTop = 0;
      this.tableBuy.scrollTop = 0;
    }
  }

  componentWillUnmount() {
    this.tableSell.removeEventListener('scroll', this.fireOnScroll);
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.market !== this.props.market) {
      this.setState({prelast: null});
    }
    if(nextProps.ticker !== this.props.ticker) {
      this.setState({prelast: this.props.ticker.last});
    }
    if(nextProps.orderBook !== this.props.orderBook) {
      const { sell, buy } = nextProps.orderBook;
      const maxBuy = buy.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
      const maxSell = sell.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
      const minBuy = buy.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), maxBuy);
      const minSell = sell.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), maxSell);
      this.setState({maxBuy, maxSell, minSell, minBuy});
    }
  }

  render() {
    const currency = this.props.market.split('-')[0];
    let sortedDataSell = [];
    let sortedDataBuy = [];
    const { sell, buy } = this.props.orderBook;
    if(sell.length) {
      sortedDataSell = this.sortData(sell);
      if(sortedDataSell === sell) {
        sortedDataSell = sell.slice(0, 50).reverse();
      } else {
        sortedDataSell = sortedDataSell.slice(0, 50);
      }
    }

    if(buy.length) {
      sortedDataBuy = this.sortData(buy).slice(0, 50);
    }
    return (
      <div className="orderbook-table chart col-12 col-sm-6 col-md-12">
        <div className="chart__top justify-content-between row">
          <div className="chart-name">Order Book  </div>
          <a role="button" className="reset-button text-muted" onClick={this.reset}>Reset sort</a>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
            </div>
          </Desktop>
        </div>
        <div className="orderbook-table-wrapper js-table-wrapper" ref={elem => this.tableSell = elem}>
          <table className="table red">
            <thead>
              <tr>
                <th onClick={() => this.onColumnSort('price')}>
                  <div>Price <span className={classNameForColumnHeader(this.state, 'price')}></span></div>
                </th>
                <th onClick={() => this.onColumnSort('Quantity')}>
                  <div>Size <span className={classNameForColumnHeader(this.state, 'Quantity')}></span></div>
                </th>
                <th onClick={() => this.onColumnSort('relativeSize')}>
                  <div>Total ({currency}) <span className={classNameForColumnHeader(this.state, 'relativeSize')}></span></div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="tbody">
              {sortedDataSell.map((order, i) => (
                <BuyOrderCell
                  onClickCapture={this.onOrderClick.bind(this, 'sell')}
                  currency={currency}
                  key={i}
                  price={order.Rate}
                  size={order.Quantity}
                  relativeSize={relativeSize(this.props.orderBook.minSell, this.props.orderBook.maxSell, order.Quantity * order.Rate)}
                />
              ))}
            </tbody>
          </table>
        </div>
        {this.renderLastPrice()}
        <div className="orderbook-table-wrapper js-table-wrapper" ref={elem => this.tableBuy = elem}>
          <table className="table green">
            <tbody>
              {sortedDataBuy.map((order, i) => (
                <BuyOrderCell
                  onClickCapture={this.onOrderClick.bind(this, 'buy')}
                  currency={currency}
                  key={i}
                  price={order.Rate}
                  size={order.Quantity}
                  relativeSize={relativeSize(this.props.orderBook.minBuy, this.props.orderBook.maxBuy, order.Quantity * order.Rate)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

    );
  }

  renderLastPrice(price) {
    const main = this.props.market.split('-')[0];
    let isUp;
    const last = this.props.ticker.l;
    const prelast = this.state.prelast;
    if(prelast && last && prelast > last) {
      isUp = false;
    } else {
      isUp = true;
    }
    return (
      <div className={classNames('value', 'last-price', 'row', isUp ? 'up' : 'down')}>
        <span onClick={() => this.props.onOrderSelect(last)}>
          {last ? defaultFormatValue(last, main) : null}</span>
        <span className={classNames('icon', 'icon-dir', isUp ? 'icon-up-dir' : 'icon-down-dir')}> </span>
      </div>
    );
  }
}

function relativeSize(minSize, maxSize, size) {
  return Math.max((size - minSize) / (maxSize - minSize), 0.02);
}

const BuyOrderCell = ({price, size, relativeSize, currency, onClickCapture} ) => {
  const sizeParts = formatFloat(size).split('.');
  return (
    <tr onClickCapture={onClickCapture} data-price={price} data-size={size} >
      <td>{defaultFormatValue(price, currency)}</td>
      <td>
        <span className="white">{sizeParts[0]}.</span>
        <span>{sizeParts[1]}</span>
      </td>
      <td>
        {defaultFormatValue(price * size, currency)}
      </td>
      <td>
        <span className="dash" style={{width: relativeSize * 100 + '%'}}/>
      </td>
    </tr>
  );
};


export default OrderBook;
