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
    let { content, isLast } = this.props;
    content = content.replace(/<br\/><br\/>/g, "\n");
    return (
      <View style={styles.Item}>
        <View style={styles.ItemTop}>
          <Text style={styles.Title}>{this.props.title}</Text>
        </View>
        <Text style={styles.Text} selectable={true}>{content}</Text>
        {isLast ? <Text style={styles.MainTitle}>来福岛笑话每天更新20条</Text> : null}
      </View>
    )
  }
}

export default class FaifudaoPage extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = ({dataSource: ds.cloneWithRows([])});
  }

  componentWillMount() {
    request('http://route.showapi.com/107-32', 17262, {}, (json) => {
        if (json.showapi_res_code == 0) {
            let jokeList = json.showapi_res_body.list;
            if (jokeList.length) {
                jokeList[jokeList.length - 1].isLast = true;
            }
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(jokeList),
          });
        }
      })
  }

  render() {
    return (
        <View>
            <ListView
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                onEndReachedThreshold={10}
                renderRow={(rowData) => {
                return <TextItem {...rowData} />
                }}
            />
        </View>
    )
  }
}

let styles = StyleSheet.create({
    MainTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#f00',
        margin: 10
    },
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
