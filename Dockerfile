FROM node:18.12.1-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV production
ENV NEXT_PUBLIC_NEXTAUTH_URL https://www.vybe.events
ENV NEXT_PUBLIC_APIURL https://api.vybe.events
ENV NEXTAUTH_SECRET IOIx20qq/F7p9SYyLUSPBzwF+NMkdPK+v5no59JaMi8=
ENV GOOGLE_CLIENT_ID 1011651920389-r2uprm55ulpmofeee44hf68km996f4q5.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET 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
ENV PROJECT_ID stealth-tickets
ENV CLIENT_EMAIL tickets-dev@stealth-tickets.iam.gserviceaccount.com
ENV PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9UVqWLDcXILNb\n7SMJVgf8tbQF7vviB9A0eHyvdAX9JT9t7clfTj7dkuQAXckhBNqWSfgtnz7WZj6Z\njJEL7cP4jHS2qxcz27vUti7+I0Wx88wb49jGD1Sglmc+6a13gw+zv0tOWgCRaux9\nNkEsdzbl2v92YveNpZy47unSG5ehEcJuleYtmcGfufjpB/5Ynzdmzuilpb6MjbNA\nP6IaOL2obuJqWJ3NurEBQdezKoOXuG6XdD+YiCivoSEUZgVBowxvoiX6SJ+HzWFV\nvBn/Ufipi/JPTINbiIA+UCII1Gr0H0IfYgF7Qzp4q9Ovhoyw9SNBumpmjoIS5/Vp\nl/QVnBDVAgMBAAECggEABwNpBjAsIvSzVZ/4JiPkQYXfsz/ntTdnN1JmrWnwa4Ys\n498lEHKfHJPmU2cmCM2bur6Rwurn0ocmIYfAuymQks1tPh53dRSE+vvRdi5gqhd8\ng7n8nABnDliUCZNxjtWxnWM5oHTwGXMAa3ZjkrNLOten6BRW1GNYEM0fp14d+g7/\nN8K7ZnBjyhg2f/a43KnWdgmcnXOwXuXD9LOqd1b8FY8Wq7frJ/4d01vwkzjvocpD\nq5fAva6Rl9ugFCNVivZ+8cTWKVfxiYagCxaQgoaA78P+EoG1+XXimUkx+KgGXLoP\nTM0tQJVGz1FvpOWjhEVU8bqQ3vq0lBfgnY9FsOE7cQKBgQDh1uY+XJpdnlCzCk/C\nsAnLtp9/MQlllINfOGao29gWKLKK0vVUYpumNst6sowqKT127JmDUKSnI3n6Ec2e\n0OOzgT9KhhZqTz891sW8Ixx5h0OPMzjzyfbAcszlnIcrxArD/pxR0P69hPv6DKjQ\nkUN/TDXxXwV/NOIxSUV9CEIgrQKBgQDWmdXhKOg9PS4XZ0N47vbEbq3pLSh3Rl7o\n3jg08RwosrwW54QF0hxxWujz1xuPyBVXY+qazyz0LDGQF597IPmh59GrH8J8NJV+\nrq6RD66D1Tp31FhCax1ePczhBNgdR1aw5XHnyVpThSNnKM187/YfAW56Kr7RDHmk\n+WhadfotyQKBgCLsz+h++6RUslgt1Q3fmXQ2hs3tsG1UHUjheQbOEMnEe2/6ldP5\n9+YpfSg5anGutQGqL0dedkgetWNV032nAj+lUjtdJyRDox0WFLg2mdW1dF415q3U\n4uL6HfO4VDMRezS6MER61JpMcYdG4+h1PoH2MDVmo3v7mqtSkHt4hnl1AoGBAMmU\n3aRQIb8MjhQryuR5S9F+ydwDsERCFPsXaqLIbZQJOMcnGAvDrzYHmFUclWY9I1bg\no0piG68NKE1a81LcycD9GiVtgunbFyZVfeMDYQGzNOXE0FcreP3CfYZNX5g5H8Sw\n8oswx6k2oefQGx4l5gJ//L/DEVUbK9T89roqoiOJAoGAW54MRrWnnHbeTtqpWNB3\nXQ1yKip8H9rkstj71umlJtOrtd0pd+JA5QlCVYWbDMwEoUjCu74a9SQAsUchw8R1\n0iF0+E+Upwl5cmFu0ri/WH92ZL2IMbf9aVkbsa+BBK+uUVovSb2Qitw6c3GExiBP\nfuc/nANRcrZVTgTVZlp10dw=\n-----END PRIVATE KEY-----\n"
ENV BUCKET_NAME vybe_production
ENV NEXT_PUBLIC_GOOGLE_API_KEY AIzaSyB0hYyI2S3b1bB--5Z-nRq2ZRcw1YXC-ag
ENV NEXT_PUBLIC_STRIPE_API_KEY pk_live_51MTFXaCUhdRlkvtYstFFvM77UoTvNY9b5viZllrVTlapGok2RiyRDNrvvvhsD6dSsOhVpJcGUksuuyUTKsuTb2ja00YTgRXKbU

COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install

COPY . /app
RUN yarn build
# start app
CMD [ "yarn", "start" ]