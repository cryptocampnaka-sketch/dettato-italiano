exports.handler = async function (event, context) {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;

  if (!key || !region) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Configuração da Azure ausente no servidor.' })
    };
  }

  try {
    const tokenResponse = await fetch(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: 'POST',
        headers: { 'Ocp-Apim-Subscription-Key': key }
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(`Azure respondeu ${tokenResponse.status}`);
    }

    const token = await tokenResponse.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ token, region })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Não foi possível gerar o token de acesso.' })
    };
  }
};