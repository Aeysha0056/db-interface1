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
  ModalFooter
} from "reactstrap";

import Toast from "./components/toast";

class Sections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      sections: []
    };
  }

  componentWillMount() {
    this.getSections();
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  getSections = () => {
    let requestBody = {
      query: `
      {
        tabs {
          name
          section {
            name
            _id
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
        let sections = result.data.tabs;
        this.setState({ fetching: true, sections });
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
            <Button onClick={this.toggle} className="mr-1" color="success">
              <i className="fa fa-plus fa-sm mr-2"></i>New Section
            </Button>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              centered
              className=""
            >
              <ModalHeader toggle={this.toggle}>New Section</ModalHeader>
              <ModalBody>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
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
                <i className="fa fa-align-justify"></i> Sections Table
              </CardHeader>
              <CardBody>
                {!this.state.fetching && <span>Loading ...</span>}

                {this.state.fetching && this.state.sections.length === 0 && (
                  <span>No Data</span>
                )}

                {this.state.fetching && this.state.sections.length !== 0 && (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Section Name</th>
                        <th>Section Type</th>
                        <th>Tab</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.sections.map(item => (
                        <tr key={item.section._id}>
                          <td>{item.section.name}</td>
                          <td>{item.section.type}</td>
                          <td>{item.name}</td>
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

export default Sections;
