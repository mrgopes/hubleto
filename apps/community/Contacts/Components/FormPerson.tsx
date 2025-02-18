import React, { Component } from 'react';
import { deepObjectMerge, getUrlParam } from 'adios/Helper';
import HubletoForm, {HubletoFormProps, HubletoFormState} from "../../../../src/core/Components/HubletoForm";
import InputTags2 from 'adios/Inputs/Tags2';
import InputTable from 'adios/Inputs/Table';
import FormInput from 'adios/FormInput';
/* import TableAddresses from './TableAddresses'; */
import TableContacts from './TableContacts';
import moment from 'moment';
import Lookup from 'adios/Inputs/Lookup';

export interface FormPersonProps extends HubletoFormProps {
  newEntryId?: number,
  creatingNew: boolean
}

export interface FormPersonState extends HubletoFormState {
  newEntryId?: number,
}

export default class FormPerson<P, S> extends HubletoForm<FormPersonProps,FormPersonState> {
  static defaultProps: any = {
    ...HubletoForm.defaultProps,
    model: 'HubletoApp/Community/Contacts/Models/Person',
  };

  props: FormPersonProps;
  state: FormPersonState;

  translationContext: string = 'HubletoApp\\Community\\Contacts\\Loader::Components\\FormPerson';

  constructor(props: FormPersonProps) {
    super(props);
    this.state = {
      ...this.getStateFromProps(props),
      newEntryId: this.props.newEntryId ?? -1,
    }
  }

  getStateFromProps(props: FormPersonProps) {
    return {
      ...super.getStateFromProps(props),
    };
  }

  normalizeRecord(record) {
    /* if (record.ADDRESSES) record.ADDRESSES.map((item: any, key: number) => {
      record.ADDRESSES[key].id_person = {_useMasterRecordId_: true};
    }); */
    if (record.CONTACTS) record.CONTACTS.map((item: any, key: number) => {
      record.CONTACTS[key].id_person = {_useMasterRecordId_: true};
    });
    if (record.TAGS) record.TAGS.map((item: any, key: number) => {
      record.TAGS[key].id_person = {_useMasterRecordId_: true};
    });

    return record;
  }

  renderTitle(): JSX.Element {
    if (getUrlParam('recordId') == -1) {
      return(
        <>
          <h2>
            {'New Person'}
          </h2>
        </>
      );
    } else {
      return (
        <>
          <h2>
            {this.state.record.last_name
              ? this.state.record.first_name + ' ' + this.state.record.last_name
              : '[Undefined Name]'}
          </h2>
        </>
      );
    }
  }

  onBeforeSaveRecord(record: any) {
    if (!record.is_main) {
      record.is_main = 0;
    }
    if (record.id == -1) {
      record.date_created = moment().format("YYYY-MM-DD");
    }

    return record;
  }

  renderContent(): JSX.Element {
    const R = this.state.record;
    const showAdditional = R.id > 0 ? true : false;

    return (
      <>
        <div className='grid grid-cols-1 gap-1' style=
          {{gridTemplateAreas:`
            'person'
            'contacts'
          `}}>
            <div className='card mt-4' style={{gridArea: 'person'}}>
              <div className='card-header'>{this.translate('Personal Information')}</div>
              <div className='card-body flex flex-row gap-2'>
                <div className="w-1/2">
                  {this.inputWrapper('first_name')}
                  {this.inputWrapper('last_name')}
                  <FormInput title={this.translate("Customer")}>
                    <Lookup {...this.getInputProps('id_customer')}
                      model='HubletoApp/Community/Contacts/Models/Customer'
                      endpoint={`customers/get-customer`}
                      value={R.id_customer}
                      readonly={this.props.creatingNew}
                      onChange={(value: any) => {
                        this.updateRecord({ id_customer: value});
                      }}
                    ></Lookup>
                  </FormInput>
                  <FormInput title={this.translate('Tags')}>
                    <InputTags2 {...this.getInputProps('id_person')}
                      value={this.state.record.TAGS}
                      model='HubletoApp/Community/Settings/Models/Tag'
                      targetColumn='id_person'
                      sourceColumn='id_tag'
                      colorColumn='color'
                      onChange={(value: any) => {
                        this.updateRecord({TAGS: value});
                      }}
                    ></InputTags2>
                  </FormInput>
                </div>
                <div className='border-l border-gray-200'></div>
                <div className="w-1/2">
                  {this.inputWrapper('is_main')}
                  {showAdditional ? this.inputWrapper('is_active') : null}
                  {showAdditional ? this.inputWrapper('date_created') : null}
                </div>
              </div>
            </div>

            <div className='card mt-4' style={{gridArea: 'contacts'}}>
              <div className='card-header'>Contacts</div>
              <div className='card-body'>
                <InputTable
                  uid={this.props.uid + '_table_contacts_input'}
                  {...this.getInputProps('contacts')}
                  value={R.CONTACTS}
                  onChange={(value: any) => {
                    this.updateRecord({ CONTACTS: value });
                  }}
                >
                  <TableContacts
                    uid={this.props.uid + '_table_contacts'}
                    context="Hello World"
                    descriptionSource="both"
                    customEndpointParams={{inForm: true}}
                    description={{
                      columns: {
                        type: {
                          type: 'varchar',
                          title: this.translate('Type'),
                          enumValues: {'email' : this.translate('Email'), 'number': this.translate('Phone Number'), 'other': this.translate('Other')},
                          //enumCssClasses: {'email' : 'bg-yellow-200', 'number' : 'bg-blue-200'},
                        },
                        value: { type: 'varchar', title: this.translate('Value')},
                        id_contact_category: { type: 'lookup', title: this.translate('Category'), model: 'HubletoApp/Community/Settings/Models/ContactType' },
                      },
                      inputs: {
                        type: {
                          type: 'varchar',
                          title: this.translate('Type'),
                          enumValues: {'email' : 'Email', 'number' : 'Phone Number', 'other': 'Other'},
                          //enumCssClasses: {'email' : 'bg-yellow-200', 'number' : 'bg-blue-200'},
                        },
                        value: { type: 'varchar', title: this.translate('Value')},
                        id_contact_category: { type: 'lookup', title: this.translate('Category'), model: 'HubletoApp/Community/Settings/Models/ContactType' },
                      }
                    }}
                  ></TableContacts>
                </InputTable>
                {this.state.isInlineEditing ? (
                  <a
                    role='button'
                    onClick={() => {
                      if (!R.CONTACTS) R.CONTACTS = [];
                      R.CONTACTS.push({
                        id: this.state.newEntryId,
                        id_person: { _useMasterRecordId_: true },
                        type: 'email',
                      });
                      this.setState({ record: R });
                      this.setState({ newEntryId: this.state.newEntryId - 1 } as FormPersonState);
                    }}
                  >
                    + Add Contact
                  </a>
                ) : null}
              </div>
            </div>
        </div>
      </>
    );
  }
}
