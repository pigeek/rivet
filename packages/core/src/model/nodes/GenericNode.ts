import { NodeImpl, type NodeImplConstructor, type NodeUIData } from '../NodeImpl.js';
import { nodeDefinition } from '../NodeDefinition.js';
import {
  type ChartNode,
  type NodeConnection,
  type NodeId,
  type NodeInputDefinition,
  type NodeOutputDefinition,
  type PortId,
} from '../NodeBase.js';
import { isArrayDataValue } from '../DataValue.js';
import { nanoid } from 'nanoid/non-secure';
import { coerceType, coerceTypeOptional, inferType } from '../../utils/coerceType.js';
import { type Inputs, type Outputs } from '../GraphProcessor.js';
import { type EditorDefinition } from '../EditorDefinition.js';
import { handleEscapeCharacters } from '../../utils/index.js';

type GenericNode<Type extends string> = ChartNode<Type, GenericNodeData>;

type GenericNodeData = {
  [key: string]: any; // To make it flexible for different node types
};

export interface GenericNodeConfig {
  type: string;
  title: string;
  data: {
    flatten: boolean;
    joinString: string;
  };
  visualData: {
    x: number;
    y: number;
    width: number;
  };
  uidata: {};
  editors: [];
  inputs: [];
  outputs: [];

}
export function createNodeImpl<T extends ChartNode>(className: string, config: GenericNodeConfig) {
  const GenericNodeImplClass = class extends NodeImpl<T> {
    getInputDefinitions(connections: NodeConnection[]): NodeInputDefinition[] {
      return config.inputs;
    }

    getOutputDefinitions(connections: NodeConnection[]): NodeOutputDefinition[] {
      return config.outputs;
    }

    getEditors(): any {
      return config.editors;
    }
  
    getBody(): string | undefined {
      return '(Join value is input)';
    }
  
    static getUIData(): NodeUIData {
      return config.uidata;
    }
  
    async process(inputData: any): Promise<Outputs> {
      return {};
    }

    static create(): T {
      const chartNode = {
        type: config.type,
        title: config.title,
        id: nanoid() as NodeId,
        data: config.data,
        visualData: config.visualData,
      } as T;
      return chartNode;
    }
  };

  Object.defineProperty(GenericNodeImplClass, 'name', { value: className });

  const genericNode = nodeDefinition(GenericNodeImplClass, config.title);

  return genericNode;
}
