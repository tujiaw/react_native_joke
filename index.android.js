import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  Text,
  TouchableHighlight,
  View,
  BackHandler,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import TextPage from './textPage.js';
import ImagePage from './imagePage.js';
import FaifudaoPage from './laifudaoPage.js';
var ScrollableTabView = require('react-native-scrollable-tab-view');

class App extends Component {
  constructor(props) {
      super(props);
      this.handleBack = this._handleBack.bind(this);
      this.backPressTime = [];
      this._navigator = null;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  _handleBack() {
    // 两秒钟之内按两次Back键退出程序
    this.backPressTime.push(new Date());
    const count = this.backPressTime.length;
    if (count >= 2) {
      const ms = this.backPressTime[count - 1] - this.backPressTime[count - 2];
      this.backPressTime = [];
      if (ms <= 2000) {
        return false;
      }
    }
    ToastAndroid.show('再按一次退出程序', ToastAndroid.SHORT);
    return true;
  }

  render() {
    return (
      <ScrollableTabView>
        <TextPage tabLabel="笑话大全" />
        <FaifudaoPage tabLabel="来福岛笑话" />
        <ImagePage tabLabel="趣图" url="http://route.showapi.com/341-2" />
        {/* <ImagePage tabLabel="动态图" url="http://route.showapi.com/341-3" /> */}
      </ScrollableTabView>
      );
    }
}

AppRegistry.registerComponent('rnjoke', () => App);
