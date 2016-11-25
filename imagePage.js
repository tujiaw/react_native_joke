import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  Text,
  TouchableHighlight,
  View,
  BackAndroid,
  ToastAndroid,
  StyleSheet,
  ListView,
  Image,
} from 'react-native';
import {request} from './common.js'
var dim = require('Dimensions');

class ImageItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.ImageItem}>
        <Text style={styles.Title}>{this.props.title}</Text>
        <Image style={styles.Image} source={{uri: this.props.img}} />
      </View>
    )
  }
}

export default class ImagePage extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = ({url: '', currentPage: 1, dataSource: ds.cloneWithRows([]), dataCache: []});
  }

  componentWillMount() {
    this.updateImageJoke(this.state.currentPage);
  }

  updateImageJoke(currentPage) {
    var params = { time: '2015-07-10', page: currentPage};
    request(this.props.url, 17262, params, (json) => {
      if (json.showapi_res_code == 0) {
        let tempCache = this.state.dataCache.concat(json.showapi_res_body.contentlist);
        this.setState({
          currentPage: json.showapi_res_body.currentPage,
          dataSource: this.state.dataSource.cloneWithRows(tempCache),
          dataCache: tempCache,
        });
      }
    })
  }

  onEndReached() {
    ToastAndroid.show('加载更多趣图', ToastAndroid.SHORT);
    this.updateImageJoke(this.state.currentPage + 1);
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        onEndReached={this.onEndReached.bind(this)}
        onEndReachedThreshold={10}
        renderRow={(rowData) => {
          return <ImageItem {...rowData} />
        }}
      />
    )
  }
}

let styles = StyleSheet.create({
  ImageItem: {
    flex: 1,
    flexDirection: 'column',
  },
  Title: {
    alignSelf: 'center',
    fontSize: 18,
  },
  Image: {
    width: dim.get('window').width,
    height: 300,
    resizeMode:'contain',
    marginBottom: 10,
  }
});
