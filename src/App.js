import React, { useEffect, useState, Fragment } from "react";
import classnames from 'classnames';
import { Image } from './components/Image';
import { Button } from './components/Button';
import { Tab } from './components/Tab';
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import { IconTitle } from './components/IconTitle';

const TABS = {
  bank: {
    iconId: "VERIFICATION_BANK_NEW",
    title: "Bank"
  },
  osko: {
    iconId: "OSKO_LOGO",
    title: "Osko (PayID)"
  }
};
const verified_status = 3;

export const App = ({
  user: { bank_account: all_accounts = [] } = {},
  titleSection,
  icons: ICONS,
  currency,
  strings: STRINGS,
  router,
  plugin_url: PLUGIN_URL,
  children,
}) => {

  const [uniqueReference, setUniqueReference] = useState(null);
  const [uniqueReferenceFetched, setUniqueReferenceFetched] = useState(false);
  const [instantpay, setInstantpay] = useState();
  const [activeTab, setActiveTab] = useState('bank');

  useEffect(() => {
    getUniqueReference();
    getInstantPay();
    //  TODO: Fix react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bank_account = all_accounts.filter(({ bank_name }) => bank_name !== "pay id");
  const osko_account = all_accounts.filter(({ bank_name }) => bank_name === "pay id");

  const verified_bank_account = bank_account.filter(({ status }) => status === verified_status);
  const has_verified_bank_account = !!verified_bank_account.length;

  const verified_osko_account = osko_account.filter(({ status }) => status === verified_status);
  const has_verified_osko_account = !!verified_osko_account.length;

  const generateUniqueReference = () => {
    axios.get(`${PLUGIN_URL}/plugins/instantpay/create-user`).then(({ data: { unique_reference } }) => {
      setUniqueReference(unique_reference)
    })
  }

  const getUniqueReference = () => {
    axios.get(`${PLUGIN_URL}/plugins/instantpay/unique-reference`).then(({ data: { unique_reference }}) => {
      setUniqueReference(unique_reference)
    })
      .finally(() => {
        setUniqueReferenceFetched(true)
      })
  }

  const getInstantPay = () => {
    axios.get(`${PLUGIN_URL}/plugins?name=instantpay`).then(({ data: { public_meta } }) => {
      setInstantpay(public_meta)
    })
  }

  const updatePath = (key, value) => {
    const { router, router: { location: { pathname }} } = this.props;
    router.push({ pathname, query: { [key]: value } })
  }

  const renderContent = () => {
    switch (activeTab) {
      case "bank": {
        return renderBankContent();
      }
      case "osko": {
        return renderOskoContent();
      }
      default: {
        return "No content";
      }
    }
  };

  const renderButtonSection = () => {
    switch (activeTab) {
      case "bank": {
        return renderBankButtonSection();
      }
      case "osko": {
        return renderOskoButtonSection();
      }
      default: {
        return "No content";
      }
    }
  }

  const renderOskoContent = () => {
    return (
      <Fragment>
        {
          !has_verified_osko_account && (
            <Fragment>
              <IconTitle
                text="Complete verification"
                iconId="VERIFICATION_BANK_NEW"
                iconPath={ICONS['VERIFICATION_BANK_NEW']}
                className="flex-direction-column"
              />
              <div className="text-align-center py-4">In order to make a deposit you are required to complete your verification. Please proceed to verification below.</div>
            </Fragment>
          )
        }
        {
          has_verified_osko_account && !uniqueReference && (
            <Fragment>
              <IconTitle
                text="Please generate your reference number below"
                iconId="GENERATE_REFERENCE_NUMBER"
                iconPath={ICONS['GENERATE_REFERENCE_NUMBER']}
                className="flex-direction-column"
              />
              <div className="text-align-center py-4">In order to make deposits you are required to generate a reference number. Your reference number should be mentioned when make your deposit within your banks description/memo field.</div>
            </Fragment>
          )
        }
        {
          has_verified_osko_account && instantpay && uniqueReference && (
            <div>
              <div>
                To make a deposit please use the details below and include the reference number in the transaction description.
              </div>

              <div className="d-flex py-4">
                <div className="bold pl-2">
                  <div>Account name:</div>
                  <div>Email:</div>
                  <div>*Reference number:</div>
                </div>
                <div className="pl-4">
                  <div>{instantpay.bankAccountName.value || '-'}</div>
                  <div>{instantpay.payId.value || '-'}</div>
                  <div>{uniqueReference || '-'}</div>
                </div>
              </div>

              <div className="d-flex align-items-baseline field_warning_wrapper">
                <ExclamationCircleFilled className="field_warning_icon" />
                <div className="field_warning_text">
                  *When making a deposit it is important to include the reference number within your deposit transactions
                </div>
              </div>
            </div>
          )
        }
      </Fragment>
    );
  }

  const renderBankContent = () => {
    return (
      <Fragment>
        {
          !has_verified_bank_account && (
            <Fragment>
              <IconTitle
                text="Complete verification"
                iconId="VERIFICATION_BANK_NEW"
                iconPath={ICONS['VERIFICATION_BANK_NEW']}
                className="flex-direction-column"
              />
              <div className="text-align-center py-4">In order to make a deposit you are required to complete your verification. Please proceed to verification below.</div>
            </Fragment>
          )
        }
        {
          has_verified_bank_account && !uniqueReference && (
            <Fragment>
              <IconTitle
                text="Please generate your reference number below"
                iconId="GENERATE_REFERENCE_NUMBER"
                iconPath={ICONS['GENERATE_REFERENCE_NUMBER']}
                className="flex-direction-column"
              />
              <div className="text-align-center py-4">In order to make deposits you are required to generate a reference number. Your reference number should be mentioned when make your deposit within your banks description/memo field.</div>
            </Fragment>
          )
        }
        {
          has_verified_bank_account && instantpay && uniqueReference && (
            <div>
              <div>
                To make a deposit please use the details below and include the reference number in the transaction description.
              </div>

              <div className="d-flex py-4">
                <div className="bold pl-2">
                  <div>Bank account number:</div>
                  <div>BSB:</div>
                  <div>Account owner:</div>
                  <div>*Reference number:</div>
                </div>
                <div className="pl-4">
                  <div>{instantpay.bankAccountNumber.value || '-'}</div>
                  <div>{instantpay.bankAccountBsb.value || '-'}</div>
                  <div>{instantpay.bankAccountName.value || '-'}</div>
                  <div>{uniqueReference || '-'}</div>
                </div>
              </div>

              <div className="d-flex align-items-baseline field_warning_wrapper">
                <ExclamationCircleFilled className="field_warning_icon" />
                <div className="field_warning_text">
                  *When making a deposit it is important to include the reference number within your deposit transactions
                </div>
              </div>
            </div>
          )
        }
      </Fragment>
    );
  }

  const renderBankButtonSection = () => {
    return (
      <Fragment>
        {
          !has_verified_bank_account && (
            <Button
              label={STRINGS["ACCOUNTS.TAB_VERIFICATION"]}
              onClick={() => router.push('/verification?initial_tab=bank&initial_bank_tab=bank')}
              className="mb-3"
            />
          )
        }
        {
          has_verified_bank_account && !uniqueReference && (
            <Button
              label="GENERATE REFERENCE NUMBER"
              onClick={generateUniqueReference}
              className="mb-3"
            />
          )
        }
        {
          has_verified_bank_account && uniqueReference && (
            <Button
              label="DEPOSIT HISTORY"
              onClick={() => router.push('transactions?tab=2')}
              className="mb-3"
            />
          )
        }
      </Fragment>
    );
  }

  const renderOskoButtonSection = () => {
    return (
      <Fragment>
        {
          !has_verified_osko_account && (
            <Button
              label={STRINGS["ACCOUNTS.TAB_VERIFICATION"]}
              onClick={() => router.push('/verification?initial_tab=bank&initial_bank_tab=osko')}
              className="mb-3"
            />
          )
        }
        {
          has_verified_osko_account && !uniqueReference && (
            <Button
              label="GENERATE REFERENCE NUMBER"
              onClick={generateUniqueReference}
              className="mb-3"
            />
          )
        }
        {
          has_verified_osko_account && uniqueReference && (
            <Button
              label="DEPOSIT HISTORY"
              onClick={() => router.push('transactions?tab=2')}
              className="mb-3"
            />
          )
        }
      </Fragment>
    );
  }

  const renderTabs = () => {
    return(
      <div
        className={classnames('custom-tab-wrapper d-flex flex-nowrap flex-row justify-content-start')}
      >
        {Object.entries(TABS).map(([key, { title, iconId }]) => {
          const tabProps = {
            key: `tab_item-${key}`,
            className: classnames('tab_item', 'f-1', {
              'tab_item-active': key === activeTab,
              pointer: setActiveTab,
            }),
          };
          if (setActiveTab) {
            tabProps.onClick = () => setActiveTab(key);
          }

          return (
            <div {...tabProps}>
              <Tab
                icon={ICONS[iconId]}
                title={title}
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (currency !== 'aud') {
    return (
      <Fragment>
        {children}
      </Fragment>
    )
  }

  return uniqueReferenceFetched && (
    <div className="withdraw-form-wrapper">
      <div className="withdraw-form">
        <Image
          icon={ICONS[`${currency.toUpperCase()}_ICON`]}
          wrapperClassName="form_currency-ball"
        />
        {titleSection}
        {renderTabs()}
        {renderContent()}
      </div>
      <div className="btn-wrapper">
        {renderButtonSection()}
      </div>
    </div>
  );
};
