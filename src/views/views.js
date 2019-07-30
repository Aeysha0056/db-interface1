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
  FormText
} from "reactstrap";

import Toast from "./components/toast";

class Views extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalData: null,
      views: []
    };
  }

  componentWillMount() {
    this.getViews();
  }

  toggle = (modalData = null) => {
    this.setState({
      modal: !this.state.modal,
      modalData
    });
    console.log(modalData);
  };

  getViews = () => {
    let requestBody = {
      query: `
      {
        values{
          name
          _id
          view {
            _id
            values
            type
          }
        }
      }
      `
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
        let views = result.data.values;
        this.viewsHandler(views);
      })
      .catch(err => {
        this.setState({ fetching: false, errorMsg: "Something Wrong!" });
        Toast("error", "Something Wrong!");
      });
  };

  viewsHandler = data => {
    let views = [];
    data.map(item => {
      if (item.view) views.push(item);
    });

    this.setState({ fetching: true, views });
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-end mr-2 mb-3">
          <Col className="col-12 col-sm-auto">
            <Button
              onClick={() => this.toggle()}
              className="mr-1"
              color="success"
            >
              <i className="fa fa-plus fa-sm mr-2"></i>New View
            </Button>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              centered
              className=""
            >
              <ModalHeader toggle={this.toggle}>
                {this.state.modalData ? `Edit ${this.state.modalData.name}` : "New View"}
              </ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="viewType">View Type</Label>
                    <Input
                      type="text"
                      name="viewType"
                      id="viewType"
                      defaultValue={this.state.modalData && this.state.modalData.view? this.state.modalData.view.type : null}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="viewValues">Values</Label>
                    <Input
                      type="text"
                      name="viewValues"
                      id="viewValues"
                      defaultValue={this.state.modalData && this.state.modalData.view? this.state.modalData.view.values : null}
                    />
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={this.toggle}>
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
                <i className="fa fa-align-justify"></i> Views Table
              </CardHeader>
              <CardBody>
                {!this.state.fetching && <span>Loading ...</span>}

                {this.state.fetching && this.state.views.length === 0 && (
                  <span>No Data</span>
                )}

                {this.state.fetching && this.state.views.length !== 0 && (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Views</th>
                        <th>type</th>
                        <th>Value</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.views.map(item => (
                        <tr key={item._id}>
                          <td>
                            {item.view.values.map((i, index) => (
                              <Table
                                responsive
                                borderless
                                size="sm"
                                key={item.view._id + index}
                              >
                                <tbody>
                                  <tr>
                                    <td>{i}</td>
                                  </tr>
                                </tbody>
                              </Table>
                            ))}
                          </td>
                          <td className="align-middle">{item.view.type}</td>
                          <td className="align-middle">{item.name}</td>
                          <td
                            className="align-middle"
                            onClick={() => this.toggle(item)}
                          >
                            <i className="fa fa-edit fa-lg mt-4 text-primary" />
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

export default Views;
