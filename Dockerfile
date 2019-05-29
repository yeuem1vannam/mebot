FROM node:10

ENV LANG C.UTF-8
RUN apt-get update -qq && apt-get install -y \
  build-essential graphviz curl vim \
  && rm -rf /var/lib/apt/lists/*

RUN echo "PS1='🐳  \[\033[1;36m\]\h \[\033[1;34m\]\W\[\033[0;35m\] \[\033[1;36m\]# \[\033[0m\]'" >> ~/.bashrc
RUN echo "alias ls='ls --color=auto'" >> ~/.bashrc
RUN echo "alias grep='grep --color=auto'" >> ~/.bashrc

RUN yarn global add yo generator-botkit

ENV EDITOR=vim
WORKDIR /workspace

CMD ["/bin/sh"]
