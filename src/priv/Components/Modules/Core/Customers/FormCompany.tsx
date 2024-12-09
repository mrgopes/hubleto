import React, { Component } from "react";
import { deepObjectMerge, getUrlParam } from "adios/Helper";
import Form, { FormDescription, FormProps, FormState } from "adios/Form";
import InputVarchar from "adios/Inputs/Varchar";
import InputTags2 from "adios/Inputs/Tags2";
import InputTable from "adios/Inputs/Table";
import FormInput from "adios/FormInput";
import TablePersons from "./TablePersons";
import TableActivities from "./TableActivities";
import TableBillingAccountServices from "../Billing/TableBillingAccountServices";
import request from "adios/Request";
import { TabPanel, TabView } from "primereact/tabview";
import { InputTextarea } from "primereact/inputtextarea";
import FormActivity from "./FormActivity";
import DateTime from "adios/Inputs/DateTime";
import Lookup from "adios/Inputs/Lookup";
import Boolean from "adios/Inputs/Boolean";
import CalendarComponent from "../Calendar/CalendarComponent";
import TableLeads from "../../Sales/TableLeads";
import FormLead from "../../Sales/FormLead";
import ModalSimple from "adios/ModalSimple";
import TableDeals from "../../Sales/TableDeals";
import FormDeal from "../../Sales/FormDeal";
import moment from 'moment';
import TableDocuments from "../Documents/TableDocuments";
import TableCompanyDocuments from "./TableCompanyDocuments";
import FormDocument from "../Documents/FormDocument";

interface FormCompanyProps extends FormProps {
  highlightIdBussinessAccounts: number,
  highlightIdActivity: number,
  createNewLead: boolean,
  createNewDeal: boolean,
  newEntryId?: number,
}

interface FormCompanyState extends FormState {
  //highlightIdBussinessAccounts: number,
  highlightIdActivity: number,
  createNewLead: boolean,
  createNewDeal: boolean,
  createNewDocument: boolean,
  showDocument: number,
  newEntryId?: number,
  //isInlineEditingBillingAccounts: boolean
}

export default class FormCompany<P, S> extends Form<
  FormCompanyProps,
  FormCompanyState
> {
  static defaultProps: any = {
    ...Form.defaultProps,
    model: "CeremonyCrmApp/Modules/Core/Customers/Models/Company",
  };

  props: FormCompanyProps;
  state: FormCompanyState;

  constructor(props: FormCompanyProps) {
    super(props);

    this.state = {
      ...this.getStateFromProps(props),
      //highlightIdBussinessAccounts: this.props.highlightIdBussinessAccounts ?? 0,
      highlightIdActivity: this.props.highlightIdActivity ?? 0,
      createNewLead: false,
      createNewDeal: false,
      createNewDocument: false,
      showDocument: 0,
      newEntryId: this.props.newEntryId ?? -1,
      //isInlineEditingBillingAccounts: false,
    }
  }

  getStateFromProps(props: FormCompanyProps) {
    return {
      ...super.getStateFromProps(props),
    };
  }

  normalizeRecord(record) {
    if (record.PERSONS)
      record.PERSONS.map((item: any, key: number) => {
        record.PERSONS[key].id_company = { _useMasterRecordId_: true };
      });
    if (record.ACTIVITIES)
      record.ACTIVITIES.map((item: any, key: number) => {
        record.ACTIVITIES[key].id_company = { _useMasterRecordId_: true };
      });
    /* if (record.BILLING_ACCOUNTS) {
      record.BILLING_ACCOUNTS.map((item: any, key: number) => {
        record.BILLING_ACCOUNTS[key].id_company = { _useMasterRecordId_: true };
        if (record.BILLING_ACCOUNTS[key].SERVICES) {
          record.BILLING_ACCOUNTS[key].SERVICES.map((item2: any, key2: number) => {
            record.BILLING_ACCOUNTS[key].SERVICES[key2].id_billing_account  = { _useMasterRecordId_: true };
          })
        }
      });
    } */
    if (record.TAGS)
      record.TAGS.map((item: any, key: number) => {
        record.TAGS[key].id_company = { _useMasterRecordId_: true };
      });

    return record;
  }

  onBeforeSaveRecord(record: any) {
    //Delete all spaces in identifiers
    if (record.tax_id) record.tax_id = record.tax_id.replace(/\s+/g, "");
    if (record.vat_id) record.vat_id = record.vat_id.replace(/\s+/g, "");
    if (record.company_id) record.company_id = record.company_id.replace(/\s+/g, "");

    return record;
  }

  renderHeaderLeft(): JSX.Element {
    return <>
      {this.state.isInlineEditing ? this.renderSaveButton() : this.renderEditButton()}
    </>;
  }

  renderHeaderRight(): JSX.Element {
    return <>
      {this.state.isInlineEditing ? this.renderDeleteButton() : null}
      {this.props.showInModal ? this.renderCloseButton() : null}
    </>;
  }

  renderTitle(): JSX.Element {
    if (getUrlParam("recordId") == -1) {
      return <h2>New Company</h2>;
    } else {
      return <h2>{this.state.record.name ? this.state.record.name : "[Undefined Name]"}</h2>;
    }
  }

  renderContent(): JSX.Element {
    const R = this.state.record;
    const showAdditional = R.id > 0 ? true : false;

    if (R.LEADS && R.LEADS.length > 0) {
      R.LEADS.map((lead, index) => {
        lead.checkOwnership = false;
        if (lead.DEAL) lead.DEAL.checkOwnership = false;
      })
    }
    if (R.DEALS && R.DEALS.length > 0) {
      R.DEALS.map((deal, index) => {
        deal.checkOwnership = false;
        if (deal.LEAD) deal.LEAD.checkOwnership = false;
      })
    }

    return (
      <>
        <TabView>
          <TabPanel header="Basic Information">
            <div
              className="grid grid-cols-2 gap-1"
              style={{
                gridTemplateAreas: `
                  'company company'
                  'contacts contacts'
                  'activities activities'
                `,
              }}
            >
              <div className="card" style={{ gridArea: "company" }}>
                <div className="card-header">Company Information</div>
                <div className="card-body flex flex-row gap-2">
                  <div className="w-1/2">
                    {this.inputWrapper("name")}
                    {this.inputWrapper("street_line_1")}
                    {this.inputWrapper("street_line_2")}
                    {this.inputWrapper("city")}
                    {this.inputWrapper("region")}
                    {this.inputWrapper("id_country")}
                    {this.inputWrapper("postal_code")}
                  </div>
                  <div className='border-l border-gray-200'></div>
                  <div className="w-1/2">
                    {this.inputWrapper("vat_id")}
                    {this.inputWrapper("company_id")}
                    {this.inputWrapper("tax_id")}
                    {showAdditional ? this.inputWrapper("date_created") : null}
                    {this.inputWrapper("is_active")}
                    <FormInput title="Tags">
                      <InputTags2
                        {...this.getDefaultInputProps()}
                        value={this.state.record.TAGS}
                        model="CeremonyCrmApp/Modules/Core/Settings/Models/Tag"
                        targetColumn="id_company"
                        sourceColumn="id_tag"
                        colorColumn="color"
                        onChange={(value: any) => {
                          this.updateRecord({ TAGS: value });
                        }}
                      />
                    </FormInput>
                    {this.inputWrapper("id_user")}
                  </div>
                </div>
              </div>

              <div className="card" style={{ gridArea: "contacts" }}>
                <div className="card-header">Contact Persons</div>
                <div className="card-body">
                  <TablePersons
                    uid={this.props.uid + "_table_persons"}
                    showHeader={false}
                    showFooter={false}
                    descriptionSource="props"
                    data={{ data: R.PERSONS }}
                    description={{
                      permissions: {
                        canCreate: true,
                        canUpdate: true,
                        canDelete: true,
                        canRead: true,
                      },
                      columns: {
                        first_name: { type: "varchar", title: "First name" },
                        last_name: { type: "varchar", title: "Last name" },
                        is_main: { type: "boolean", title: "Main Contact" },
                        __more_details: { type: "none", title: "", cellRenderer: ( table: TablePersons, data: any, options: any): JSX.Element => {
                            if (data.id > 0) {
                              return (<>
                                  <button
                                    className="btn btn-transparent btn-small"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      table.openForm(data.id);
                                      return false;
                                    }}
                                  >
                                    <span className="icon"><i className="fas fa-external-link-alt"></i></span>
                                  </button>
                                </>
                              );
                            }
                          },
                        },
                      },
                    }}
                    isUsedAsInput={true}
                    isInlineEditing={this.state.isInlineEditing}
                    readonly={!this.state.isInlineEditing}
                    onRowClick={(table: TablePersons, row: any) => {
                      if (this.state.isInlineEditing == false) {
                        this.setState({ isInlineEditing: true });
                      }
                    }}
                    onChange={(table: TablePersons) => {
                      this.updateRecord({ PERSONS: table.state.data?.data });
                    }}
                    onDeleteSelectionChange={(table: TablePersons) => {
                      this.updateRecord({ PERSONS: table.state.data?.data ?? [] });
                    }}
                  ></TablePersons>
                  {this.state.isInlineEditing ? (
                    <a
                      role="button"
                      onClick={() => {
                        if (!R.PERSONS) R.PERSONS = [];
                        R.PERSONS.push({
                          id: this.state.newEntryId,
                          id_company: { _useMasterRecordId_: true },
                          is_main: false,
                          is_active: true,
                          date_created: moment().format("YYYY-MM-DD")
                        });
                        this.setState({ record: R });
                        this.setState({ newEntryId: this.state.newEntryId - 1 } as FormCompanyState);
                      }}>
                      + Add contact
                    </a>
                  ) : null}
                </div>
              </div>


            </div>
          </TabPanel>
          {showAdditional ? (
            <TabPanel header="Activities">
              <CalendarComponent
                creatingForModel="Company"
                creatingForId={R.id}
                views={"timeGridDay,timeGridWeek,dayGridMonth,listYear"}
                url={`activities/get?creatingForModel=Company&creatingForId=${R.id}`}
              ></CalendarComponent>
            </TabPanel>
          ) : null}
          {showAdditional ? (
            <TabPanel header="Leads">
              <TableLeads
                uid={this.props.uid + "_table_leads"}
                data={{ data: R.LEADS }}
                descriptionSource="props"
                description={{
                  permissions: {
                    canCreate: true,
                    canUpdate: true,
                    canDelete: true,
                    canRead: true,
                  },
                  columns: {
                    title: { type: "varchar", title: "Title" },
                    price: { type: "float", title: "Amount" },
                    id_currency: { type: "lookup", title: "Amount", model: 'CeremonyCrmApp/Modules/Core/Settings/Models/Currency' },
                    date_expected_close: { type: "date", title: "Expected Close Date" },
                  },
                }}
                isUsedAsInput={false}
                //isInlineEditing={this.state.isInlineEditing}
                readonly={true}
                onRowClick={(table: TableLeads, row: any) => {
                  table.openForm(row.id);
                }}
                onDeleteSelectionChange={(table: TableLeads) => {
                  this.updateRecord({ LEADS: table.state.data?.data ?? [] });
                }}
              />
              <a
                role="button"
                onClick={() => {this.setState({ createNewLead: true } as FormCompanyState);}}>
                + Add Lead
              </a>
              {this.state.createNewLead == true ? (
                <ModalSimple
                  uid='lead_form'
                  isOpen={true}
                  type='right'
                >
                  <FormLead
                    id={-1}
                    isInlineEditing={true}
                    descriptionSource="both"
                    description={{
                      defaultValues: {
                        id_company: R.id,
                      }
                    }}
                    showInModal={true}
                    showInModalSimple={true}
                    onClose={() => { this.setState({ createNewLead: false } as FormCompanyState); }}
                    onSaveCallback={(form: FormLead<FormLeadProps, FormLeadState>, saveResponse: any) => {
                      if (saveResponse.status = "success") {
                        R.LEADS.push(saveResponse.savedRecord);
                        this.setState({ record: R });
                      }
                    }}
                  />
                </ModalSimple>
              ): null}
            </TabPanel>
          ) : null}
          {showAdditional ? (
            <TabPanel header="Deals">
              <TableDeals
                uid={this.props.uid + "_table_deals"}
                data={{ data: R.DEALS }}
                descriptionSource="props"
                description={{
                  permissions: {
                    canCreate: true,
                    canUpdate: true,
                    canDelete: true,
                    canRead: true,
                  },
                  columns: {
                    title: { type: "varchar", title: "Title" },
                    price: { type: "float", title: "Amount" },
                    id_currency: { type: "lookup", title: "Amount", model: 'CeremonyCrmApp/Modules/Core/Settings/Models/Currency' },
                    date_expected_close: { type: "date", title: "Expected Close Date" },
                  },
                }}
                isUsedAsInput={false}
                //isInlineEditing={this.state.isInlineEditing}
                readonly={false}
                onRowClick={(table: TableDeals, row: any) => {
                  table.openForm(row.id);
                }}
                onDeleteSelectionChange={(table: TableDeals) => {
                  this.updateRecord({ DEALS: table.state.data?.data ?? [] });
                }}
              />
              <a
                role="button"
                onClick={() => {this.setState({ createNewDeal: true } as FormCompanyState);}}>
                + Add Deal
              </a>
              {this.state.createNewDeal == true ? (
                <ModalSimple
                  uid='deal_form'
                  isOpen={true}
                  type='right'
                >
                  <FormDeal
                    id={-1}
                    isInlineEditing={true}
                    descriptionSource="both"
                    description={{
                      defaultValues: {
                        id_company: R.id,
                      }
                    }}
                    showInModal={true}
                    showInModalSimple={true}
                    onClose={() => { this.setState({ createNewDeal: false } as FormCompanyState); }}
                    onSaveCallback={(form: FormDeal<FormDealProps, FormDealState>, saveResponse: any) => {
                      if (saveResponse.status = "success") {
                        R.DEALS.push(saveResponse.savedRecord);
                        this.setState({ record: R });
                      }
                    }}
                  />
                </ModalSimple>
              ): null}
            </TabPanel>
          ) : null}
          {showAdditional ? (
            <TabPanel header="Documents">
              <TableCompanyDocuments
                uid={this.props.uid + "_table_deals"}
                data={{ data: R.DOCUMENTS }}
                descriptionSource="props"
                description={{
                  ui: {
                    showFooter: false,
                    showHeader: false,
                  },
                  permissions: {
                    canCreate: true,
                    canDelete: true,
                    canRead: true,
                    canUpdate: true
                  },
                  columns: {
                    id_document: { type: "lookup", title: "Document", model: "CeremonyCrmApp/Modules/Core/Documents/Models/Document" },
                  }
                }}
                isUsedAsInput={true}
                //isInlineEditing={this.state.isInlineEditing}
                readonly={!this.state.isInlineEditing}
                onRowClick={(table: TableCompanyDocuments, row: any) => {
                  this.setState({showDocument: row.id_document} as FormCompanyState);
                }}
              />
              <a
                role="button"
                onClick={() => this.setState({createNewDocument: true} as FormCompanyState)}
              >
                + Add Document
              </a>
              {this.state.createNewDocument == true ?
                <ModalSimple
                  uid='document_form'
                  isOpen={true}
                  type='right'
                >
                  <FormDocument
                    id={-1}
                    descriptionSource="both"
                    isInlineEditing={true}
                    creatingForModel="Company"
                    creatingForId={this.state.id}
                    description={{
                      defaultValues: {
                        creatingForModel: "Company",
                        creatingForId: this.state.record.id,
                      }
                    }}
                    showInModal={true}
                    showInModalSimple={true}
                    onClose={() => { this.setState({ createNewDocument: false } as FormCompanyState) }}
                    onSaveCallback={(form: FormDocument<FormDocumentProps, FormDocumentState>, saveResponse: any) => {
                      if (saveResponse.status = "success") {
                        this.loadRecord();
                        this.setState({ createNewDocument: false } as FormCompanyState)
                      }
                    }}
                  ></FormDocument>
                </ModalSimple>
              : null}
              {this.state.showDocument > 0 ?
                <ModalSimple
                  uid='document_form'
                  isOpen={true}
                  type='right'
                >
                  <FormDocument
                    id={this.state.showDocument}
                    onClose={() => this.setState({showDocument: 0} as FormCompanyState)}
                    creatingForModel="Company"
                    showInModal={true}
                    showInModalSimple={true}
                    onSaveCallback={(form: FormDocument<FormDocumentProps, FormDocumentState>, saveResponse: any) => {
                      if (saveResponse.status = "success") {
                        this.loadRecord();
                      }
                    }}
                  />
                </ModalSimple>
              : null}
            </TabPanel>
          ) : null}
          <TabPanel header="Notes">
            {this.input("note")}
          </TabPanel>
        </TabView>

          {/* <div>
            <div className="card">
              <div className="card-header">this.state.record</div>
              <div className="card-body">
                <pre
                  style={{
                    color: "blue",
                    width: "100%",
                    fontFamily: "Courier New",
                    fontSize: "10px",
                  }}
                >
                  {JSON.stringify(R.PERSONS, null, 2)}
                </pre>
              </div>
            </div>
          </div> */}
        {/* </div> */}
      </>
    );
  }
}
