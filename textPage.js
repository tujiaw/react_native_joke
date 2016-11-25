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
} from 'react-native';
import {request} from './common.js'

class TextItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let text = this.props.text;
    text = text.replace(/<p>/g, "");
    text = text.replace(/<\/p>/g, "");
    return (
      <View style={styles.Item}>
        <View style={styles.ItemTop}>
          <Text style={styles.Title}>{this.props.title}</Text>
          <Text style={styles.Title}>{this.props.ct.slice(5, 16)}</Text>
        </View>
        <Text style={styles.Text}>{text}</Text>
      </View>
    )
  }
}

let g_textJoke = [];
export default class TextPage extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = ({currentPage: 1, dataSource: ds.cloneWithRows([])});
  }

  componentWillMount() {
    this.updateTextJoke(this.state.currentPage);
  }

  updateTextJoke(currentPage) {
    var params = { time: '2015-07-10', page: currentPage};
    request('http://route.showapi.com/341-1', 17262, params, (json) => {
      if (json.showapi_res_code == 0) {
        g_textJoke = g_textJoke.concat(json.showapi_res_body.contentlist);
        this.setState({
          currentPage: json.showapi_res_body.currentPage,
          dataSource: this.state.dataSource.cloneWithRows(g_textJoke),
        });
      }
    })
  }

  onEndReached() {
    ToastAndroid.show('加载更多笑话', ToastAndroid.SHORT);
    this.updateTextJoke(this.state.currentPage + 1);
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        onEndReached={this.onEndReached.bind(this)}
        onEndReachedThreshold={10}
        renderRow={(rowData) => {
          return <TextItem {...rowData} />
        }}
      />
    )
  }
}

let styles = StyleSheet.create({
  Item: {
    padding: 10,
  },
  ItemTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingRight: 10,
  },
  Title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  Text: {
    fontSize: 14,
  }
})
