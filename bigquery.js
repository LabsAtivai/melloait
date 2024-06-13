const axios = require("axios");
const { auth } = require("google-auth-library");
const { google } = require("googleapis");
const { timeout } = require("puppeteer");
const { PrismaClient } = require("@prisma/client");

const credentials = {
  type: "service_account",
  project_id: "relatoriolistas",
  private_key_id: "64a6d54341cf1bcb8c1786436fcb782d2f5abd9c",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZsEHQywpruYEw\nJkfY4weq1TqI3R0o/nJvSL6xKDNGcU/6Yixc6Je4455GnLC8hfF960Pm624PVkPJ\nC4HJvwaD3pSz2HNl9FRHnBAJXaGGz/eax1jTbdvzBxpZ+W3GceA8mPODazP5tETx\nSCU8ExWkPdYd3GLoz5NrpBuVvUnRx927f+/2qrVh122F70JJ2NPfEITcOLJNluJC\n3tYoNKIkUkELqdP7FaxsPprW5Ug0O0n32pWQv0LjVyzJb0JP7mbAPIV5hBVV4Ajs\nIt2k+QuJRCPGEdEc2OvFD9HBgxEc6CBST97nra1FyQRbYX6AUBHTfsFzZFxgVH0d\nAMxJam11AgMBAAECggEACsksEaYlxN2i9C70C1/VqZYOuZOfFhYOtyCBwPGuzLQ2\nPr/Y1oejENhHp38Bq22a4Al6n/k/8ZxCwouClEDrQo284hunksB5i+IZ0fpPfl2q\nioLgY1AZAEsfTUr0W0tEItcp5Z6NAOJ43K2dmVg8D8W36LCFPrzI30yjyJZhjyEX\nwulYtFp8XCCLp2Limy45K9BprllAeCpGAIcaDNQfz8l8M6tzc7BdTDV77os1BblG\n6jakWLFhAfAaOyC8DrRovd9G7loUeEt9zZ3jOJf7Qr+oc96iN5G7poDN/lUJt6QK\nXFbwGWKmn7ZuwtjtdETOtPDWAcv4q75iF9bHXCmmQQKBgQD5GCxMkyREcbE4QtAQ\nCUrOQO15MAFOer0AH3UF+fRX+hzJAHAa79Fr8IQ9hdgLJK05caOmwvD5kmoRpKtN\nfMboPGF9iVyGGMRHQSpNh6cQ9bl4awq+Y+atwH9z/03AlJLg1MGd1sYD1qoFcUzg\n5Z97FqGMfvLnLIsnzXutBrhbVQKBgQDfuTIcHQQQ1r6efW6+kL8VgCihXYqXap8O\nmwCZCfwtAHeP8iE76sllqasVy5TLkNoUZrbedUQiIowza7Iwp4vfTk9b2devN6U3\nRb25I1XadT9+oEDyTdXvbI4DtwLDLNWYmZXXL/yebw0JMZxxXFWqD0yHuWiNOx03\ncJbpITcJoQKBgQCwKg1iVonGshVgsbfOL5QtDDQmifHSm/FAvf6YLG9HLQbgjKO8\nGTElwmLz0824C8dKofjYPnQIPSkwsyHHWmCd694S12uNFsTxk7+kNzTLRM1XwXRG\ntAZ3iXVaBwvpD+pUgYMw6qz+F/oEgV2ajCre9WFpKHsHTTRZAPTfqKoHRQKBgCe3\nBpA7Dme212vnNGub4m/8qjnLEzlB8i5zka2ZOiz68j6ZaxDp4wqrDfX2h9mDQ1Nv\n0HK5OnkczOqr6Zv9gjUH/8p8Z29xX2Dqfn2JKkp3mefuptjcvGeeS6+ZI2JmaRyH\n1zO2DxBJAnVpWy48h/CCesF1RnwbzFn1ILUN8mlBAoGAMipMiz2mSDWiz2B3AeV9\n9yAt4WSSdX3JJrN60MIZAySFCokatzaF2wa611/lzdYn/XCa79GyOWT2TWs4jibj\nt4S8RlCMNTCU97SAtgwXksBK2WbXtORmgTLJRRdmz+/GCSIfuwzXr/uaR7NY1uoh\nIwdLfzHHnPbRJFmNi9xgiPU=\n-----END PRIVATE KEY-----\n",
  client_email: "ativarelatorio@relatoriolistas.iam.gserviceaccount.com",
  client_id: "101717739329184491985",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/ativarelatorio%40relatoriolistas.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
//função para listar campanhas do usuario
//import { PrismaClient } from "@prisma/client";
async function Authori(clientId, clientSecret) {
  try {
    const response = await axios.post(
      "https://api.snov.io/v1/oauth/access_token",
      {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Erro ao obter o token de acesso:", error);
    throw error;
  }
}
async function ListarCampanhas(authorize) {
  try {
    const response = await axios.get("https://api.snov.io/v1/get-user-lists", {
      headers: {
        Authorization: `Bearer ${authorize}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao obter o token de acesso:", error);
    throw error;
  }
}

async function ListarPotencialLista(authorize, listID) {
  try {
    const response = await axios.post(
      "https://api.snov.io/v1/prospect-list",
      {
        listId: listID,
      },
      {
        headers: {
          Authorization: `Bearer ${authorize}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao obter o token de acesso:", error);
    throw error;
  }
}

async function potencialCliente(authorize, clientId) {
  try {
    const response = await axios.post(
      "https://api.snov.io/v1/get-prospect-by-id",
      {
        id: clientId,
      },
      {
        headers: {
          Authorization: `Bearer ${authorize}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao obter o token de acesso:", error);
    throw error;
  }
}
//async function pegardominio(authorize,dominio, type, limit, lastId)

async function listarEmails(authorize, firstName, lastName, dominio) {
  try {
    const response = await axios.post(
      "https://api.snov.io/v1/get-emails-from-names",
      {
        firstName: firstName,
        lastName: lastName,
        domain: dominio,
      },
      {
        headers: {
          Authorization: `Bearer ${authorize}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao obter o token de acesso:", error);
    throw error;
  }
}

const prisma = new PrismaClient();
async function InseirNaBase(client) {
  await await prisma.bigQueryAtiva.create({
    data: {
      id: client.id,
      email: client.email, //
      name: client.name, //
      firstname: client.firstName, //
      lastname: client.lastName, //
      locality: client.locality, //
      country: client.currentJob[0].country, //
      linkedin: client.social[0].link,
      companyname: client.currentJob[0].companyName,
      position: client.currentJob[0].position,
      company_linkedin: client.currentJob[0].socialLink,
      site: client.currentJob[0].site, //
      company_state: client.currentJob[0].state,
      company_size: client.currentJob[0].size, //
      company_industry: client.currentJob[0].industry, //
      company_country: client.currentJob[0].country,
      company_locality: client.locality,
      dominio: client.dominio ?? client.email.split("@")[1].split(".")[0], //
    },
  });
}

async function ConsultarCliente(email) {
  const datail = await prisma.bigQueryAtiva.findFirst({
    where: {
      email: email,
    },
  });
  return datail;
}
async function Criticas(base, atualizado) {
  const criticas = [];
  if (!base) {
    if (!atualizado?.name) {
      criticas.push("Name é obrigatório!");
    }
    if (!atualizado?.firstName) {
      criticas.push("FirstName é obrigatório");
    }
    if (!atualizado?.lastName) {
      criticas.push("LastName é obrigatório");
    }
    if (!atualizado?.locality) {
      criticas.push("Locality é obrigatório");
    }
    if (!atualizado?.currentJob[0].country) {
      criticas.push("Country é obrigatório!");
    }
    if (!atualizado?.currentJob[0].socialLink) {
      criticas.push("Position é obrigatório!");
    }
    // if (!atualizado?.dominio) {
    //   criticas.push("Dominio é obrigatório!");
    // }
    if (!atualizado?.currentJob[0].size) {
      criticas.push("CompanySize é obrigatório!");
    }
  } else {
    if (!!base.locality && !atualizado.locality) {
      criticas.push("Locality atual está sem informação");
    }
    if (!!base.country && !atualizado?.currentJob[0].country) {
      criticas.push("Country sem informação!");
    }
    if (!!base.naame && !atualizado.name) {
      criticas.push("name sem informação!");
    }
    if (!!base.firstName && !atualizado.firstName) {
      criticas.push("First Name sem informação!");
    }
    if (!!base.lastName && !atualizado.lastame) {
      criticas.push("lastName sem informação!");
    }
    if (!!base.socialLink && !atualizado?.currentJob[0].socialLink) {
      criticas.push("Position atual está sem informação");
    }
    // if (!!base.dominio && !atualizado.dominio) {
    //   criticas.push("Dominio atual está sem informação");
    // }
    if (!!base.companySize && !atualizado?.currentJob[0].size) {
      criticas.push("CompanySize atual está sem informação");
    }
  }

  return criticas;
}
async function AtualizarBase(base) {
  return await prisma.bigQueryAtiva.update({
    where: {
      id: base.id,
    },
    data: {
      name: base.name, //
      firstname: base.firstName, //
      lastname: base.lastName, //
      locality: base.locality, //
      country: base.currentJob[0].country, //
      linkedin: base.social[0].link,
      companyname: base.currentJob[0].companyName,
      position: base.currentJob[0].position,
      company_linkedin: base.currentJob[0].socialLink,
      site: base.currentJob[0].site, //
      company_state: base.currentJob[0].state,
      company_size: base.currentJob[0].size, //
      company_industry: base.currentJob[0].industry, //
      company_country: base.currentJob[0].country,
      company_locality: base.locality,
      dominio: base.dominio ?? base.email.split("@")[1].split(".")[0], //
    },
  });
}
const processClient = async (client, authorize) => {
  try {
    if (client?.id) {
      const clients = await potencialCliente(authorize, client.id);
      return clients.data;
    }
  } catch (error) {
    if (error.response.status == "401") {
      authorize = await Authori(
        "caef970f0faa42d2dd5d3610ad9bf95c",
        "9bac00fb12dfacbe0d5977d5f776a934"
      );
      const clients = await potencialCliente(authorize, client.id);
      return clients.data;
    }
  }
  return null;
};

const processAllClients = async (potenciais, authorize) => {
  const promises = potenciais.prospects.map((client) =>
    processClient(client, authorize)
  );
  const results = await Promise.all(promises);
  return results.filter((result) => result !== null); // Filter out any null results
};

const processList = async (lista) => {
  if (request === 50) {
    await sleep(1000);
    request = 0; // Reset request count after sleep
  }
  const potenciais = await ListarPotencialLista(authorize, lista.id);
  request++;
  return potenciais.prospects;
};

const processAllLists = async (listas) => {
  const results = await Promise.all(listas.map(processList));
  prospects = results.flat(); // Flatten the array of arrays into a single array
};

async function rodar() {
  let potenciaisClients = [];
  let authorize = await Authori(
    "caef970f0faa42d2dd5d3610ad9bf95c",
    "9bac00fb12dfacbe0d5977d5f776a934"
  );

  let request = 1;
  const listas = await ListarCampanhas(authorize);
  let prospects = [];

  processAllLists(listas).then(() => {
    console.log("All lists processed:", prospects);
  });
  for (const lista of listas) {
    try {
      // if (potenciaisClients.length) break;
      const potenciais = await ListarPotencialLista(authorize, lista.id);
      for (let client of potenciais.prospects) {
        try {
          if (client?.id) {
            const clients = await potencialCliente(authorize, client.id);

            potenciaisClients.push(clients.data);
            const json = clients.data;
          }
        } catch (error) {
          if (error.response.status == "401") {
            authorize = await Authori(
              "caef970f0faa42d2dd5d3610ad9bf95c",
              "9bac00fb12dfacbe0d5977d5f776a934"
            );
            const clients = await potencialCliente(authorize, client.id);

            potenciaisClients.push(clients.data);
          }
        }
      }
      for (let client of potenciaisClients) {
        try {
          let tentativas = 0;
          let emails;

          if (!(!!client.currentJob && !!client.currentJob[0].site)) {
            continue;
          }
          try {
            if (!client.currentJob[0].site.split("/")[2]) continue;
            emails = await listarEmails(
              authorize,
              client.firstName,
              client.lastName,
              client.currentJob[0].site.split("/")[2]
            );
          } catch (error) {
            authorize = await Authori(
              "caef970f0faa42d2dd5d3610ad9bf95c",
              "9bac00fb12dfacbe0d5977d5f776a934"
            );
            if (!client.currentJob[0].site.split("/")[2]) continue;
            emails = await listarEmails(
              authorize,
              client.firstName,
              client.lastName,
              client.currentJob[0].site.split("/")[2]
            );
          }

          while (emails.status.identifier != "complete") {
            if (tentativas >= 3) break;
            await sleep(6000);
            emails = await listarEmails(
              authorize,
              client.firstName,
              client.lastName,
              client.currentJob[0].site.split("/")[2]
            );
            tentativas++;
          }
          if (tentativas >= 3) {
            tentativas = 0;
            continue;
          } else {
            tentativas = 0;
          }
          if (!emails?.data?.emails[0]?.email) continue;
          client.email = emails.data.emails[0].email;
          let base = await ConsultarCliente(client.email);

          let criticas = await Criticas(base, client);

          if (!criticas.length) {
            if (!base) {
              let ins = await InseirNaBase(client);
              console.log(ins);
            } else {
              client.id = base.id;
              let up = await AtualizarBase(client);
              console.log(up);
            }
          } else {
            console.warn("-----------------------------------------------");
            console.warn(client.email);
            criticas.map((x) => {
              console.log(x);
            });
            console.warn("-----------------------------------------------");
          }
          potenciaisClients = [];
        } catch (err) {
          console.error(err);
        }
      }
      potenciaisClients = [];
    } catch (error) {
      if (error.response.status == "401") {
        authorize = await Authori(
          "caef970f0faa42d2dd5d3610ad9bf95c",
          "9bac00fb12dfacbe0d5977d5f776a934"
        );
        let potenciais = await ListarPotencialLista(authorize, lista.id);
        for (let client of potenciais.prospects) {
          try {
            const clients = await potencialCliente(authorize, client.id);

            potenciaisClients.push(clients.data);
          } catch (error) {
            if (error.response.status == "401") {
              authorize = await Authori(
                "caef970f0faa42d2dd5d3610ad9bf95c",
                "9bac00fb12dfacbe0d5977d5f776a934"
              );
              const clients = await potencialCliente(authorize, client.id);

              potenciaisClients.push(clients.data);
            }
          }
        }

        for (let client of potenciaisClients) {
          try {
            let tentativas = 0;
            let emails;

            if (!(!!client.currentJob && !!client.currentJob[0].site)) {
              continue;
            }
            try {
              if (!client.currentJob[0].site.split("/")[2]) continue;
              emails = await listarEmails(
                authorize,
                client.firstName,
                client.lastName,
                client.currentJob[0].site.split("/")[2]
              );
            } catch (error) {
              authorize = await Authori(
                "caef970f0faa42d2dd5d3610ad9bf95c",
                "9bac00fb12dfacbe0d5977d5f776a934"
              );
              if (!client.currentJob[0].site.split("/")[2]) continue;
              emails = await listarEmails(
                authorize,
                client.firstName,
                client.lastName,
                client.currentJob[0].site.split("/")[2]
              );
            }

            while (emails.status.identifier != "complete") {
              if (tentativas >= 3) break;
              await sleep(12000);
              emails = await listarEmails(
                authorize,
                client.firstName,
                client.lastName,
                client.currentJob[0].site.split("/")[2]
              );
              tentativas++;
            }
            if (tentativas >= 3) {
              tentativas = 0;
              continue;
            } else {
              tentativas = 0;
            }

            client.email = emails.data.emails[0].email;
            let base = await ConsultarCliente(client.email);

            let criticas = await Criticas(base, client);

            if (!criticas.length) {
              if (!base) {
                let ins = await InseirNaBase(client);
                console.log(ins);
              } else {
                client.id = base.id;
                let up = await AtualizarBase(client);
                console.log(up);
              }
            } else {
              console.warn("-----------------------------------------------");
              console.warn(client.email);
              criticas.map((x) => {
                console.log(x);
              });
              console.warn("-----------------------------------------------");
            }
          } catch (err) {
            console.error(err);
          }
        }
        potenciaisClients = [];
      }
    }

    sleep(1500);
  }
}

async function addToGoogleSheets(client, campaignData) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1IMH9GB0lmksuobxjGQmsVe1C2t04d1g-v9xEspnMKTY";
    const range = "campanhas";

    const today = new Date();
    const dateWithoutTime = today.toISOString().split("T")[0];

    const values = campaignData.map((campaign) => [
      dateWithoutTime,
      client.email,
      campaign.id,
      campaign.campaign || campaign,
      campaign.list_id,
      campaign.status,
      campaign.created_at,
      campaign.updated_at,
      campaign.started_at,
      campaign.hash,
    ]);

    if (values.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
          values,
        },
      });
      console.log("Dados de campanha adicionados com sucesso ao Google Sheets");
    } else {
      console.log(
        "Nenhuma campanha ativa encontrada para adicionar ao Google Sheets"
      );
    }
  } catch (error) {
    console.error(
      "Erro ao adicionar dados de campanha ao Google Sheets:",
      error
    );
  }
}

async function getCampaignName(accessToken, clientEmail) {
  try {
    const response = await axios.get(
      "https://api.snov.io/v1/get-user-campaigns",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao obter informações da campanha:",
      error.response.errors
    );
    throw error;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// async function main() {
//   try {
//     const auth = await google.auth.getClient({
//       credentials,
//       scopes: "https://www.googleapis.com/auth/spreadsheets",
//     });

//     const clients = await readClientDataFromSheet(auth);
//     const batchSize = 60;

//     for (let i = 0; i < clients.length; i += batchSize) {
//       const batch = clients.slice(i, i + batchSize);
//       console.log(`Processando lote de ${batch.length} clientes...`);

//       for (const client of batch) {
//         try {
//           const accessToken = await getAccessToken(
//             client.clientId,
//             client.clientSecret
//           );
//           const campaignData = await getCampaignName(accessToken, client.email);
//           await addToGoogleSheets(client, campaignData);
//         } catch (error) {
//           console.error("Erro na execução para cliente:", client.email, error);
//         }
//       }

//       if (i + batchSize < clients.length) {
//         console.log("Aguardando antes de processar o próximo lote...");
//         await sleep(30000); // Espera de 30 segundos antes do próximo lote
//       }
//     }
//   } catch (error) {
//     console.error("Erro na execução principal:", error);
//   }
// }

rodar();
