const queue = "rel_listas_queue";
import * as amqp from 'amqplib'
import axios from "axios";
import { google } from "googleapis";


const credentials = {
    type: "service_account",
    project_id: "relatoriolistas",
    private_key_id: "e25ed131b297c4f1b9a88c500a6a92562ba9cab2",
    private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpllxFoFzUmvIY\ncIx9QwYTQnSl68bJBy255ZU4Hd/tMJNlb7HDeACyp8X0V4ou2+bBczb1RZqEPtyi\n4kaKzPpz3e10mZfMBFIi37HtEi7IGi+IfrkUkVAXPKO68zT0nN63nGboErd91Dn4\nRvRgYxz0XDf1T74u7McGHjfhcsy5nu58SuHLhyxWZxlUlrdFSmSszdzKw1CKO8AZ\nq3HYId7iclyhmrZo360NDrPOVjDTy0Lb01K6dVw8TErVDgrxGwqMy/HXPmSZI+Tm\nX58oglkob/Iri3h7UODIxcR1MQ0IolRmkmvWw/RDL7MnnEpqTuV/FP7UTOWLSNun\n+7CUtBJpAgMBAAECggEAFBZG4WniWP3t41Jwd5VQ4sbeN3l3CyBuLHzauQID4C2+\n5bbOStl71q1762pTiCOcoGkP10s6Z0PlYSc1ZRMsrrz4l3UqZ1xTKMWPhwW+dA3y\n96NP85VXM9tnRtlwGjG7CStNvpsZ8B3rTGLGJyUSPMjwCV7bx2XdGJbLdmkhQfKV\nfHzlZPHTKSn37K9G9j1QvVTYqGvw020BzGgyfr5KoQcSsEFEE+Mu9p3HAwdSdty+\n8w56/NsDzan/D89zXEUlWhMEh8t0oTNXGrSWB7XiCHDXKVRYham+HE6kkVNL9qNj\neIWP+bMIjYt1p3N6DTzJwK1rJHFlyzzr4/+dMCxYcQKBgQDcHtwhHIWYDlnhkCxt\nLKRJ9oI7H7jjz+VglMx7S1KvxarIe+ue3RgRnntHV6aHaMPs8U5M2ria2pkscHDs\ny1QsoxGBerZ3gCB8LLlY6sT69iVUI+byVykgUDL/I6LRxw7TTBsNPesff+DCSdaL\nzU+ZNctUxkTq/2KBE8z4JBMj2QKBgQDFOtzVtFZcBC1zkZroRvuX+NsMGgS7XIGw\n92r8JFDMSjrPmc6XjR+Lk2vj+/ZIDAf7FECMv805EkLQs7RALaI9e03P+f3W21YR\nZpDxHi+uFaMmIG0BYbi6lBw7yne1wMEp4uiiZ5fgLM92y4oLi42Cj9TZDtNRCEeN\nxsrCr9KZEQKBgQCWA5ISHtYNIvqudwtP/DSbE5z9nkjrOSwh/ka9YEAh+pzBtXKG\n+jcFCvUJUfr0HbopKOssBYP6RTBO0PKk7o2XPisYCwF/v5pkBjbrGlTUlBwsk6s5\nTZ2BoCahKzAzt22rIxrsk15CQWxz/M5yyKGO0NKaG+WsIhCH127BThSdQQKBgCbD\nv/3c2RBy3cAWQT0gHnkrN1p0jrOIphDzQDrYpGzStiZxk5Jj8WxMiGsh7bERdEwc\nGefQFvT9qtY8S9RFY9rzrkKPXx3otEztPNW3WiW8KPnoa6RW4akCTV5PGCJIBW9H\nIvQwqkAsboZp0PMd9a1QucQDzvLhTrcF+Ho1do4RAoGAU5N2Lc9Ur3HYycoSZDGQ\nQ8i7dz549gYTOCeIRyxOKwaZe04yTHax6lrwWxThpSj9keP8d8Jjvu5gqtup9EAb\nTZgSKyoqmx3V02y4/+9FDxavoHVf/wVHMAzckQMcPAIkUkpsWOLNOI7pmetGaZEG\ng4P2NhbZYJNl7+QTbSfxQzU=\n-----END PRIVATE KEY-----\n",
    client_email: "ativarelatorio@relatoriolistas.iam.gserviceaccount.com",
    client_id: "101717739329184491985",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/ativarelatorio%40relatoriolistas.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
};

async function getAccessToken(clientId, clientSecret, attempt = 1) {
    try {
        const response = await axios.post("https://api.snov.io/v1/oauth/access_token", {
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
        });
        console.log(`✅ Token obtido com sucesso para o clientId: ${clientId}`);
        return response.data.access_token;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.warn(`⚠️ Rate limit 429 ao buscar token. Dormindo 1 minuto... (tentativa ${attempt})`);
            await sleep(60000);
            return getAccessToken(clientId, clientSecret, attempt + 1);
        } else {
            console.error(`❌ Erro ao obter token para clientId ${clientId}:`, error.response?.data || error.message);
            throw error;
        }
    }
}

async function connectRabbitMQ() {
    let connection;
    const options = { frameMax: 0, heartbeat: 60 };
    while (!connection) {
        try {
            connection = await amqp.connect("amqp://admin:admin123@207.244.249.157:5672", options);
        } catch {
            console.log("Erro conectando ao RabbitMQ... tentando novamente em 5s");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    return connection;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryGetCampaignProgress(accessToken, campaignId, attempt = 1) {
    try {
        const response = await axios.get(`https://api.snov.io/v2/campaigns/${campaignId}/progress`, {
            params: { access_token: accessToken },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 429 && error.response.status === 422) {
            console.warn(`⚠️ API rate limit atingido (429). Dormindo 1 minuto antes de tentar novamente... (tentativa ${attempt})`);
            await sleep(60000);  // Dorme 60 segundos
            return tryGetCampaignProgress(accessToken, campaignId, attempt + 1);
        } else {
            console.error(`❌ Erro ao buscar progresso da campanha ${campaignId}:`, error.response?.data || error.message);
            throw error;
        }
    }
}

async function appendToGoogleSheets(sheets, rowsToInsert) {
    if (!rowsToInsert.length) return;
    const spreadsheetId = "1IMH9GB0lmksuobxjGQmsVe1C2t04d1g-v9xEspnMKTY";
    const sheetName = "unfinished";
    const existing = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!A:A` });
    const nextRow = existing.data.values ? existing.data.values.length + 1 : 1;
    const endRow = nextRow + rowsToInsert.length - 1;

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A${nextRow}:D${endRow}`,
        valueInputOption: "RAW",
        resource: { values: rowsToInsert },
    });
}

async function receiveMessage() {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            try {
                const message = JSON.parse(msg.content.toString());
                const { client, campaign, retries = 0 } = message;

                const auth = await google.auth.getClient({
                    credentials,
                    scopes: "https://www.googleapis.com/auth/spreadsheets",
                });
                const sheets = google.sheets({ version: "v4", auth });
                await sleep(10000)
                const newAccessToken = await getAccessToken(client.clientId, client.clientSecret);
                const progress = await tryGetCampaignProgress(newAccessToken, campaign.id);

                const unfinished = progress.unfinished || 0;

                if (unfinished === 0) {
                    if (retries < 4) {
                        channel.sendToQueue(queue, Buffer.from(JSON.stringify({
                            ...message,
                            retries: retries + 1,
                        })), { persistent: true });
                        console.warn(`🔁 Campanha ${campaign.id} com unfinished=0. Tentativa ${retries + 1}/4`);
                    } else {
                        console.error(`❌ Campanha ${campaign.id} falhou após 4 tentativas com unfinished=0`);
                    }
                } else {
                    await appendToGoogleSheets(sheets, [[campaign.id, campaign.name, unfinished, client.email]]);
                    console.log(`✅ Campanha ${campaign.id} gravada no Sheets.`);

                    await sleep(2000);
                }

            } catch (error) {


                if (error?.response?.data?.data?.message && error?.response?.data?.data?.message.include('not found')) {
                    console.log(error.response.data.data.message);
                    // tratativa de error por email
                } else
                    if (error.response.status === 422 || error.response.status === 429) {
                        channel.sendToQueue(queue, Buffer.from(JSON.stringify({
                            ...message,
                            retries: retries + 1,
                        })), { persistent: true });
                    } else
                        console.error(`Erro ao processar campanha:`, error.response.message);
            } finally {
                channel.ack(msg);
            }
        }
    });

    connection.on("close", async () => {
        console.error("RabbitMQ fechado. Reconnect...");
        await receiveMessage();
    });

    connection.on("error", async (error) => {
        console.error("Erro na conexão RabbitMQ:", error.message);
        await receiveMessage();
    });
}

receiveMessage();
