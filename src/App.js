import React, { useEffect, useState, Fragment } from "react";
import { Image } from './components/Image';
import { Button } from './components/Button';
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';

export const App = ({
  user: { bank_account = [] } = {},
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

  useEffect(() => {
    getUniqueReference();
    getInstantPay();
    //  TODO: Fix react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const verified_status = 3;
  const verified_bank_account = bank_account.filter(({ status }) => status === verified_status);
  const has_verified_bank_account = !!verified_bank_account.length;

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
        {
          !has_verified_bank_account && (
            <div>In order to make a deposit you are required to complete your verification. Please proceed to verification below.</div>
          )
        }
        {
          has_verified_bank_account && !uniqueReference && (
            <div>In order to make deposits you are required to generate a reference number. Your reference number should be mentioned when make your deposit within your banks description/memo field.</div>
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
                  <div>{instantpay.bankAccountNumber.value}</div>
                  <div>{instantpay.bankAccountBsb.value}</div>
                  <div>{instantpay.bankAccountName.value}</div>
                  <div>{uniqueReference}</div>
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
      </div>
      {
        !has_verified_bank_account && (
          <Button
            label={STRINGS["ACCOUNTS.TAB_VERIFICATION"]}
            onClick={() => router.push('/verification')}
          />
        )
      }
      {
        has_verified_bank_account && !uniqueReference && (
          <Button
            label="GENERATE REFERENCE NUMBER"
            onClick={generateUniqueReference}
          />
        )
      }
    </div>
  );
};
