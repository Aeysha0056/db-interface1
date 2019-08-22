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

class Values extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalData: null,
      values: []
    };
  }

  componentWillMount() {
    this.getValues();
  }

  toggle = (modalData = null) => {
    this.setState({
      modal: !this.state.modal,
      modalData
    });
    console.log(modalData);
  };

  getValues = () => {
    let requestBody = {
      query: `
      {
        sections {
          name
          _id
          values {
            _id
            name
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
        let values = result.data.sections;
        console.log(values);
        this.setState({ fetching: true, values });
      })
      .catch(err => {
        this.setState({ fetching: false, errorMsg: "Something Wrong!" });
        Toast("error", "Something Wrong!");
      });
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-end mr-2 mb-3">
          <Col className="col-12 col-sm-auto">
            <Button onClick={()=> this.toggle()} className="mr-1" color="success">
              <i className="fa fa-plus fa-sm mr-2"></i>New Value
            </Button>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              centered
              className=""
            >
              <ModalHeader toggle={this.toggle}>
              {this.state.modalData ? `Edit ${this.state.modalData.name}` : "New Value"}
              </ModalHeader>
              <ModalBody>
                {/*Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.*/}
                <Form>
                  <FormGroup>
                    <Label for="valueName">Value Name</Label>
                    <Input
                      type="text"
                      name="valueName"
                      id="valueName"
                      defaultValue={this.state.modalData && this.state.modalData.value ? this.state.modalData.value.name : null}
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
                <i className="fa fa-align-justify"></i> Values Table
              </CardHeader>
              <CardBody>
                {!this.state.fetching && <span>Loading ...</span>}

                {this.state.fetching && this.state.values.length === 0 && (
                  <span>No Data</span>
                )}

                {this.state.fetching && this.state.values.length !== 0 && (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Value Name</th>
                        <th>Section</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.values.map(section => (
                        <tr key={section._id}>
                          <td>
                            {section.values.map((val, index) => (
                              <Table responsive borderless size="sm" key={val._id + index}>
                                <tbody>
                                  <tr>
                                    <td>{val.name}</td>
                                  </tr>
                                </tbody>
                              </Table>
                            ))}
                          </td>
                          <td className="align-middle">{section.name}</td>
                          <td
                            className="align-middle"
                            onClick={() => this.toggle(section)}
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
                      {/**this.state.values.map(section => {
                        if (!section.values) return;
                        return section.values.map(val => (
                          <tr key={val._id}>
                            <td>{val.name}</td>
                            <td>{section.name}</td>
                          </tr>
                        ));
                      })*/}
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

export default Values;
