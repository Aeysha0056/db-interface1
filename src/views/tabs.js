import React, { Component } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

import Toast from "./components/toast";

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalData: null,
      tabs: [],
      tabName: '',
    };
  }

  componentWillMount() {
    this.getTabs();
  }

  toggle = (modalData = null) => {
    this.setState({
      modal: !this.state.modal,
      modalData
    });
    console.log(modalData);
  };

  getTabs = () => {
    let requestBody = {
      query: `
      {
        tabs {
          _id
          name
        }
      }`
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          this.setState({
            fetching: false,
            errorMsg: "Server response not received."
          });
          Toast("error", "Server response not received.");
        }
        return res.json();
      })
      .then(result => {
        let tabs = result.data.tabs;
        this.setState({ fetching: true, tabs });
      })
      .catch(err => {
        this.setState({ fetching: false, errorMsg: "Something Wrong!" });
        Toast("error", "Something Wrong!");
      });
  };

  /**
  * handling input change
  */
  handleInputChanged = (event) => {
    let name = event.target.name
    this.setState({ [name]: event.target.value })
  }

  /**
   * add new tab to db
   * @method
   */
  addNewTab = () => {
    let tabs = this.state.tabs
    let requestBody = {
      query: `
    mutation addTab ($tabName: String!)
    { 
      addTab (name: $tabName) {
        _id
        name
      }
    }`,
      variables: {
        "tabName": this.state.tabName
      }

    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          this.setState({
            fetching: false,
            errorMsg: "Server response not received."
          });
          Toast("error", "Server response not received.");
        }
        return res.json();
      })
      .then(result => {
        tabs.push(result.data.addTab)
        this.setState({ fetching: true, tabs: tabs });
        this.toggle()
        Toast("success", "Successfully added!");
      })
      .catch(err => {
        this.setState({ fetching: false, errorMsg: "Something Wrong!" });
        console.log(err)
        Toast("error", "Something Wrong!");
      });
  };

  /**
   * edit tab 
   * @method
   */
  editTab = () => {
    //to delete the item from tabs state list 
    let tabs = this.state.tabs.filter(tab => tab._id !== this.state.modalData._id);
    console.log(tabs)
    let requestBody = {
      query: `
    mutation editTab ($id: String! $tabName: String!)
    { 
      editTab (id: $id name: $tabName) {
        _id
        name
      }
    }`,
      variables: {
        "tabName": this.state.tabName,
        "id": this.state.modalData._id
      }

    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          this.setState({
            fetching: false,
            errorMsg: "Server response not received."
          });
          Toast("error", "Server response not received.");
        }
        return res.json();
      })
      .then(result => {
        tabs.push(result.data.editTab)
        this.setState({ fetching: true, tabs: tabs });
        this.toggle()
        Toast("success", "Successfully updated!");
      })
      .catch(err => {
        this.setState({ fetching: false, errorMsg: "Something Wrong!" });
        console.log(err)
        Toast("error", "Something Wrong!");
      });
  };

  render() {
    console.log(this.state.tabName)
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-end mr-2 mb-3">
          <Col className="col-12 col-sm-auto">
            <Button onClick={()=> this.toggle()} className="mr-1" color="success">
              <i className="fa fa-plus fa-sm mr-2"></i>New Tab
            </Button>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              centered
              className=""
            >
              <ModalHeader toggle={this.toggle}>
              {this.state.modalData ? `Edit ${this.state.modalData.name}` : "New Tab"}
              </ModalHeader>
              <ModalBody>
              <Form>
                  <FormGroup>
                    <Label for="tabName">Tab Name</Label>
                    <Input
                      type="text"
                      name="tabName"
                      id="tabName"
                      defaultValue={this.state.modalData && this.state.modalData? this.state.modalData.name : null}
                      onChange={this.handleInputChanged}
                    />
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={this.state.modalData? this.editTab : this.addNewTab}>
                  Save
                </Button>{" "}
                <Button color="danger" outline onClick={this.toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Tabs Table
              </CardHeader>
              <CardBody>
                {!this.state.fetching && <span>Loading ...</span>}

                {this.state.fetching && this.state.tabs.length === 0 && (
                  <span>No Data</span>
                )}

                {this.state.fetching && this.state.tabs.length !== 0 && (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.tabs.map(item => (
                        <tr key={item._id}>
                          <td>{item.name}</td>
                          <td
                            className="align-middle"
                            onClick={() => this.toggle(item)}
                          >
                            <i className="fa fa-edit fa-lg mt-4 text-primary" />
                          </td>
                          <td
                            className="align-middle"
                            onClick={" "}
                          >
                            <i className="fa fa-trash fa-lg mt-4 text-primary" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Tabs;
