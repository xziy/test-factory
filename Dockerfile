FROM node:14-alpine as planner
WORKDIR /app
COPY ./project/package.json .
COPY ./project/package-lock.json .


FROM node:14-alpine as cacher
WORKDIR /app
COPY --from=planner /app/package.json .
COPY --from=planner /app/package-lock.json .
RUN npm install

FROM git.hm:5050/webresto/factory/frontend-builder:next
WORKDIR /app

RUN apt install jq rsync -y
RUN echo "update transport-cli #1"
# install transport-cli for make tests
RUN npm i @webresto/transport-cli -g --unsafe-perm

# ENV YARN_CACHE_FOLDER=/pnpm_store/yarn
# ENV NODE_OPTIONS=--max-old-space-size=4096

RUN mkdir -p /cache
COPY --from=cacher /app/node_modules /cache/node_modules

RUN mkdir -p /app/layouts/base_layouts
COPY . /app/layouts/base_layouts

RUN transport validate --folder /app/layouts/base_layouts

COPY ./.ci/bootstrap .
COPY ./.ci/testing-web-server/ ./testing-web-server/
COPY .ci/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY .ci/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./.CI_ENV .

# Here solving for known problem in coreDNS kuberenetes
RUN echo `dig +short fonts.googleapis.com | awk '{ print ; exit }'` "fonts.googleapis.com" >> /etc/hosts

ENTRYPOINT ["/bin/bash","bootstrap"]