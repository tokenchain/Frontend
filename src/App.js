import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import {apiGet, ApiError} from './generic/apiCall';
import {loggedIn, loggedOut} from './actions/auth';
import { Provider } from 'react-redux';
import MainContent from './MainContentContainer';
import Navigation from './Navigation';
import { fetchTime } from './actions/time';
import { Container, Row } from 'reactstrap';
import './App.css';
import $ from 'jquery';
window.jQuery = window.$ = $;
window.Tether = require('tether');
window.Popper = require('popper.js');
require('floatthead');
require('bootstrap');
require('malihu-custom-scrollbar-plugin');

window.uncustomize = function() {
  $(document).off('click');
}
window.customize = function() {
  console.log('component did mount');
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  /*
    Global: Sticky table headers
    */
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
  $('.js-table-wrapper table').each(function(index, el) {
    let $table = $(el);
    processScrollableTable($table);
  });



  /*
    Global: Dropdowns behavior
    */



  /*
    Ratings: 'Rank legend' popover
    */
  $('[data-toggle="ratings-help-popover"]').popover({
    trigger: 'hover',
    container: $('.ratings-main'),
    html: true,
    animation: false,
    template: `
      <div class="popover help-popover">
        <div class="arrow"></div>
        <div class="popover-body"></div>
      </div>`,
    content: function() {
      let total   = $(this).data('total');
      let success = $(this).data('success');
      let investors = $('.ratings-investors.active').length ? ' success-investors' : '';

      return `
        <div class="total row">
          <div><span class="round"></span></div>
          <div><span>${total}</span></div>
        </div>
        <div class="success row${investors}">
          <div><span class="round"></span></div>
          <div><span>${success}</span></div>
        </div>`;
    }
  });


  /*
    Ratings: ROI chart period selectbox
    */


  $('.icon-fullscreen').each(function() {
    $(this).click(function() {
      let element = $(this).parent().parent().parent().parent().parent().get(0);
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      }
      else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    });
  });

  function editGroupEnable() {
    if($('#cmn-toggle-4').prop('checked')) {
      $('.info-screen').addClass('edit-block');
      $('.edit-btn').addClass('active');
      $('.edit-btn').text('save changes');
    } else {
      $('.info-screen').removeClass('edit-block');
      $('.edit-btn').removeClass('active');
      $('.edit-btn').text('edit');
    }
    console.log($('.info-screen').hasClass('disable-block'));
    if($('.info-screen').hasClass('disable-block')) {
      $('.duration-contract .form-control').prop('disabled',true);
      $('#cmn-toggle-4').prop('disabled',true);

    }
  }
  editGroupEnable();
  $( '#cmn-toggle-4' ).on( 'click', editGroupEnable );

  var mobileScreenShowButton = ($group, $item, countItem, textMore, textLess,heightEle) => {
    let heightList = 0;
    $item.each(function(i,el) {
      if(i == countItem) {
        return false;
      } else {
        heightList += heightEle || $(this).height();
      }
    });
    if($item.length > countItem) {

      //$(".feedback-card .card-body .list-group").height(heightList)
      let countClickedMore = 0;
      /*if($(".feedback-card .card-body .list-group .list-group-item").length > 10) {
        $(".feedback-card .card-body .list-group .list-group-item").each(function(i,el) {
          if(i > 9) {
            $(this).css("display", "none")
          }
        })
      }*/
    } else {
      $group.height(heightList);
    }
  };

  $(window).resize((e) => {
    if($(window).width() > 1020){

      $('.currency-settings tbody').height($('.currency-settings .card-body').outerHeight() - $('.currency-settings thead th').outerHeight());

      $('.currency-settings tbody').mCustomScrollbar({
        theme:'light-3',
        scrollButtons:{
          enable:false
        },
        setHeight: ($('.currency-settings .card-body').outerHeight() - $('.currency-settings thead th').outerHeight()),
        mouseWheel:{ preventDefault: true },
        scrollbarPosition: 'inside',
        autoExpandScrollbar:true,
        theme: 'dark'
      });

      $('.feedback-card .card-body .list-group').height($('.feedback-card .card-body').outerHeight() - 50);
      $('.feedback-card .card-body .list-group').mCustomScrollbar({
        theme:'light-3',
        scrollButtons:{
          enable:false
        },
        mouseWheel:{ preventDefault: true },
        scrollbarPosition: 'outside',
        autoExpandScrollbar:true,
        theme: 'dark'
      });
      $('.feedback-card .card-body .list-group .mCSB_draggerContainer').height($('.feedback-card .card-body').outerHeight() + 50);

      $('input[type="text"]').focus(function(){
        $(this).data('placeholder',$(this).attr('placeholder'))
          .attr('placeholder','');
      }).blur(function(){
        $(this).attr('placeholder',$(this).data('placeholder'));
      });
      console.log($('.currency-settings .card-body').outerHeight(), $('.currency-settings thead th').outerHeight()); //apply scrollbar with your options
    }else{
      //$(selector).mCustomScrollbar("destroy"); //destroy scrollbar
      $('.currency-settings tbody').mCustomScrollbar('destroy');

      $('.feedback-card .card-body .list-group').mCustomScrollbar('destroy');

      /*let heightList = 0;
      $(".feedback-card .card-body .list-group .list-group-item").each(function(i,el) {
        if(i == 5) {
          return false
        } else {
          heightList += $(this).height()
        }
      })
      if($(".feedback-card .card-body .list-group .list-group-item").length > 5) {

    //$(".feedback-card .card-body .list-group").height(heightList)
        let countClickedMore = 0;
        $(".feedback-card .card-body .list-group").readmore({
          collapsedHeight:heightList,
          speed: 500,
          moreLink: '<div class="d-flex justify-content-center show-feedbacks-block"><button type="button" class="show-feedbacks-btn btn btn-secondary">show next 5 feedbacks</button></div>',
          lessLink: '<div class="d-flex justify-content-center show-feedbacks-block"><button type="button" class="show-feedbacks-btn btn btn-secondary">show less 5 feedbacks</button></div>',
          afterToggle: function(trigger, element, expanded) {
            if(! expanded) {
    //$(".feedback-card .card-body .list-group").readmore('toggle');
            }
          }
        });
      } else {
        $(".feedback-card .card-body .list-group").height(heightList)
      }*/
    mobileScreenShowButton($('.feedback-card .card-body .list-group'),$('.feedback-card .card-body .list-group .list-group-item'), 5,'show next 5 feedbacks','show less 5 feedbacks');
    //mobileScreenShowButton($(".currency-settings table tbody"),$(".currency-settings tbody tr") ,10 ,'show next 10 currencies' ,'show previous 10 currencies',$(".currency-settings tbody tr:not(.empty-tr) td").outerHeight())



  }
  }).trigger('resize');



  $(document).on('click', function(e) {
    if (!$(e.target).closest('.all-time').length && !$(e.target).closest('.all-time_dropdown').length) {
      $('.all-time').popover('hide');
    }

    if (!$(e.target).closest('.dropdown').length && !$(e.target).closest('.dropdown-link').length) {
      $('.dropdown-link').popover('hide');
    }
  });
}


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      if(typeof window.web3 !== 'undefined') {
        window.web3 = new window.Web3(window.web3.currentProvider);
      }
      if(store.getState().auth.loggedIn) {
        apiGet('/profile')
          .then(({profile}) => {
            store.dispatch(loggedIn(profile));
          })
          .catch(err => {
            if(err.apiErrorCode && err.apiErrorCode === ApiError.FORBIDDEN) {
              store.dispatch(loggedOut());
            }
          })
          .then(() => {
            this.setState({loading: false});
          });
      } else {
        this.setState({loading: false});
      }
    });
    store.dispatch(fetchTime());
    this.timeInterval = setInterval(() => {
      store.dispatch(fetchTime());
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  render() {
    return (
      <Provider store={store}>
        {this.state.loading ? <div/> : (<MainRouter />)}
      </Provider>
    );
  }
}

const MainRouter = () => (
  <BrowserRouter>
    <Container className="main-panel" fluid>
      <Row noGutters className='flex-wrap flex-md-nowrap'>
        <Navigation />
        <MainContent />
      </Row>
    </Container>
  </BrowserRouter>
);





export default App;
