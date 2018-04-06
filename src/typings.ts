import React from 'react';

export interface ActionPayload {
  actor: string;
  duration: number;
  motion?: string;
  targets?: number[];
}

export interface Action {
  type: string;
  payload?: any;
}

export interface Directive {
  wait: number;
  stagger?: number;
  action?: Action;
  actions?: Action[];
}

export interface Scene {
  wait: number;
  directives: Directive[];
}

export type Script = Map<string, Scene>;

export class ActorComponent extends React.Component<any> {
  container: Element;
  children: Element[];
}
