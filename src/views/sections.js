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
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
//import { DropdownList } from "react-widgets";
import Toast from "./components/toast";

class Sections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalData: null,
      dropdownOpen: false,
      sections: []
    };
  }

  componentWillMount() {
    this.getSections();
  }

  toggle = (modalData = null) => {
    this.setState({
      modal: !this.state.modal,
      modalData
    });
    console.log(modalData);
  };

  dropDownToggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }


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
            <Button onClick={()=> this.toggle()} className="mr-1" color="success">
              <i className="fa fa-plus fa-sm mr-2"></i>New Section
            </Button>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              centered
              className=""
            >
              <ModalHeader toggle={this.toggle}>
              {this.state.modalData ? `Edit ${this.state.modalData.name}` : "New Section"}
              </ModalHeader>
              <ModalBody>
              <Form>
                  <FormGroup>
                    <Label for="sectionName">Section Name</Label>
                    <Input
                      type="text"
                      name="sectionName"
                      id="sectionName"
                      defaultValue={this.state.modalData && this.state.modalData.section? this.state.modalData.section.map((section) => (section.name)) : null}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="sectionType">Section Type</Label>
                    <Input
                      type="text"
                      name="sectionType"
                      id="sectionType"
                      defaultValue={this.state.modalData && this.state.modalData.section? this.state.modalData.section.map(section => (section.type)) : null}
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
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.sections.map(item => (
                        <tr key={item.section._id}>
                          <td>{item.section.name}</td>
                          <td>{item.section.type}</td>
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

export default Sections;
