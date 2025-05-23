FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system cisense && \
  adduser --system -G cisense cisense

COPY dist/apps/api cisense/
COPY dist/apps/web cisense/assets/
RUN chown -R cisense:cisense .

RUN npm --prefix cisense --omit=dev -f install

CMD [ "node", "cisense" ]
