/* tslint:disable:no-console jsx-no-lambda */
// import { Button, Icon, Layout, Row, Select, Spin } from "antd";
import { Layout, Spin } from "antd";
import Axios from 'axios';
import * as React from 'react';
// import * as Autocomplete from "react-autocomplete";
import '../node_modules/antd/es/input/style/index.css';
import Head from "./components/Head";
import Nav from "./components/Nav";
import ForceGraph from "./dataViz/BasicForce";
import { IData } from "./testData/leMis";

const { Content } = Layout;

interface IGlobalState {
  collapsed: boolean;
  currentFetch: string;
  data: IData | null;
  distance: number;
  height: number;
  search: string[];
  selectedFetch: string;
  value1: string;
  value2: string;
  width: number;

}

export default class App extends React.Component {
  
  public state: IGlobalState = {
    collapsed: false,
    currentFetch: 'surroundings',
    data: null,
    distance: 1,
    height: 0,
    search: [],
    selectedFetch: 'paths',
    value1: 'Mammal',
    value2: '',
    width: 0
  };

  public divElement: any = {};

  
  public componentDidMount() {

    const height = this.divElement.clientHeight;
    const width = this.divElement.clientWidth;

    Axios.post('http://localhost:3005/api/surroundings', { source: this.state.value1, distance: 1 })
      .then(({ data }) => {
        const graphData: IData = data;

        Axios.get('http://localhost:3005/api/nodesList')
          // tslint:disable-next-line:no-shadowed-variable
          .then(( { data } ) => {
            const searchOpts: string[] = data;

            this.setState({
              data: graphData,
              height,
              search: searchOpts,
              width,
            })
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }


  public render() {
    const { data, search } = this.state;

      return (
        <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
          <Nav collapsed={this.state.collapsed} select={this.handleSelect} view={this.state.currentFetch}/>
          <Layout>
            <Head 
              collapsed={this.state.collapsed} 
              toggleSider={this.toggle} 
              suggestions={search} 
              input1={this.state.value1} 
              input2={this.state.value2} 
              ctrlInput={this.controlledInput} 
              ctrlSelect1={this.controlledSelect1}
              ctrlSelect2={this.controlledSelect2}
              view={this.state.currentFetch}
              chgView={this.handleChange}
              postPaths={this.postPaths}
              postPath={this.postPath}
              postSurroundings={this.postSurroundings}
            />
              {data !== null ? 
                (
                <Content
                  style={{ margin: '24px 24px', padding: 24, background: '#fff', width: '92vw', height: '100vh'}}
                  >
                    <div ref={ divElement => {this.divElement = divElement}} style={{ height: '100vh', width: `${!this.state.collapsed ? '94vw' : '90vw'}` }}>
                      <ForceGraph width={this.state.width} height={this.state.height} data={data}/>
                    </div>
                  </Content>) :
                (<Content>  
                  <div ref={ divElement => {this.divElement = divElement}} style={{ height: '100vh', width: '90vw' }}>
                    <Spin size="large" />
                  </div>
                </Content>)
              }
          </Layout>
        </Layout>
      );
    }
    
  private postPaths = () => {
      Axios.post('http://localhost:3005/api/paths', { source: this.state.value1, target: this.state.value2 })
        // tslint:disable-next-line:no-shadowed-variable
        .then(({ data }) => {
          const graphData: IData = data;
          this.setState({
            data: graphData,
          })
        })
        .catch((err) => console.error(err));
    }

  private postPath = () => {
    Axios.post('http://localhost:3005/api/path', { source: this.state.value1, target: this.state.value2 })
    // tslint:disable-next-line:no-shadowed-variable
    .then(({ data }) => {
      const graphData: IData = data;
      this.setState({
        data: graphData,
      })
    })
    .catch((err) => console.error(err));
  }

  private postSurroundings = () => {
    Axios.post('http://localhost:3005/api/surroundings', { source: this.state.value1, distance: this.state.distance })
    // tslint:disable-next-line:no-shadowed-variable
    .then(({ data }) => {
      const graphData: IData = data;
      this.setState({
        data: graphData,
      })
    })
    .catch((err) => console.error(err));
  }

  private toggle = () => {

    const height = this.divElement.clientHeight;
    const width = this.divElement.clientWidth;

    this.setState({
      collapsed: !this.state.collapsed,
      height,
      width,
    });
  }

  private handleSelect = (e: any) => {
    this.setState({
      currentFetch: e.key,
    });
  }

  private handleChange = (e: any) => {
    console.log('hangling change', e);
    this.setState({
      // tslint:disable-next-line:radix
      distance: parseInt(e)
    });
  }

  private controlledInput = (e: any) => {
    
    const inputId = e.target.id;

    if (inputId === "value1") {
      this.setState({ value1: e.target.value })
    } else {
      this.setState({ value2: e.target.value })
    }
  }

  private controlledSelect1 = ( value1: string) => {
    this.setState({
      value1
    });
  }

  private controlledSelect2 = (value2: string) => {
    this.setState({
      value2
    });
  }

}