import { useState } from 'react';
import {
  Form,
  FormControl,
  Button,
  TextInput
} from '@contentful/f36-components';

import { SlugEditor } from '@contentful/field-editor-slug';
import { FieldAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {

  const [bitlyUrl, setBitlyUrl] = useState<string>();
  const [fullUrl, setFullUrl] = useState<string>();

  const sdk = useSDK<FieldAppSDK>();
  const { apiKey, url } = sdk.parameters.installation;

  sdk.window.startAutoResizer();
  sdk.window.updateHeight();

  sdk.field.onValueChanged((e) => {
    const newFullUrl = url + sdk.field.getValue()
    if (fullUrl !== newFullUrl) {
      setFullUrl(newFullUrl);
    }
  })

  async function handleSubmit(e: any) {

    e.preventDefault();

    const longUrl = fullUrl;
    await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        long_url: longUrl,
        domain: "bit.ly"
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBitlyUrl(data.link);
      });
  };

  return (
      <Form>
        <FormControl>
            <TextInput  value={fullUrl} isDisabled={true} />
            <br /><br />
            <SlugEditor field={sdk.field} baseSdk={sdk}  />
            <br />
            {bitlyUrl && <>{bitlyUrl} <br /> <br /></>}
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}>
              Generate Bitly URL

            </Button>
        </FormControl>
      </Form>
  );
};

export default Field;