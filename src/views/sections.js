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

class Sections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalData: null,
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

 
 /**
  * handling input change
  */
 handleInputChanged = (event) => {
  let name = event.target.name
  this.setState({ [name]: event.target.value })
}

  getSections = () => {
    let requestBody = {
      query: `
      {
        tabs {
          name
          _id
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

  /**
    * add new section to db
    * @method
    */
  addNewSection = () => {
    let { sections, sectionName, sectionType } = this.state
    let tab = sections.find(tab => tab.name === this.state.tabName);
    console.log(tab)
    let requestBody = {
      query: `
    mutation addSection ($tabId: String!, $sectionName: String!, $sectionType: String!)
    { 
      addSection (tabId: $tabId , name: $sectionName , type: $sectionType) {
        _id
        name
        type
      }
    }`,
      variables: {
        "tabId": tab._id,
        "sectionName": sectionName,
        "sectionType": sectionType
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
        tab.section = result.data.addSection
        this.setState({ fetching: true, sections: sections });
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
  * edit sections info 
  * @method
  */
  editSection = () => {
    let { sectionName, sectionType, modalData } = this.state
    //to delete the item from tabs state list 
    let sections = this.state.sections.filter(tab => tab._id !== this.state.modalData._id);

    let requestBody = {
      query: `
    mutation editSection ($id: String!, $sectionName: String, $sectionType: String)
    { 
      editSection (id: $id , name: $sectionName , type: $sectionType) {
        _id
        name
        type
      }
    }`,
      variables: {
        "id": modalData.section._id,
        "sectionName": sectionName ? sectionName : modalData.section.name,
        "sectionType": sectionType ? sectionType : modalData.section.type
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
        modalData.section = result.data.editSection
        sections.push(modalData)
        this.setState({ fetching: true, sections: sections });
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
                    <Label for="tabName">Select Tab</Label>
                    <Input type="select" name="tabName" id="tabName"
                     defaultValue={this.state.modalData && this.state.modalData.section? this.state.modalData.name : null}
                     onChange={this.handleInputChanged}>
                    {this.state.sections.map(item => (
                      <option>{item.name}</option>
                    ))}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="sectionName">Section Name</Label>
                    <Input
                      type="text"
                      name="sectionName"
                      id="sectionName"
                      defaultValue={this.state.modalData && this.state.modalData.section? this.state.modalData.section.name : null}
                      onChange={this.handleInputChanged}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="sectionType">Section Type</Label>
                    <Input
                      type="select"
                      name="sectionType"
                      id="sectionType"
                      defaultValue={this.state.modalData && this.state.modalData.section? this.state.modalData.section.type : null}
                      onChange={this.handleInputChanged}
                    >
                    <option>single</option>
                    <option>multi</option>
                    </Input>
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={this.state.modalData? this.editSection : this.addNewSection}>
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
                        <tr key={item.section? item.section._id: null}>
                          <td>{item.section? item.section.name: null}</td>
                          <td>{item.section? item.section.type: null}</td>
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
