import { computed, ComputedRef, Ref, onUnmounted } from 'vue';
import { IInnerTreeNode, ITreeNode, IUseCore, valueof } from './use-tree-types';
import { generateInnerTree } from './utils';

const DEFAULT_CONFIG = {
  expanded: false, // 是否只从展开了的节点中获取数据
  recursive: true, // 是否需要获取非直接子节点
};
const nodeMap = new Map<string, IInnerTreeNode[]>();
export default function (): (data: Ref<IInnerTreeNode[]>) => IUseCore {
  return function useCore(data: Ref<IInnerTreeNode[]>): IUseCore {
    const getLevel = (node: IInnerTreeNode): number => {
      return data.value.find((item) => item.id === node.id)?.level;
    };

    const getChildren = (node: IInnerTreeNode, userConfig = DEFAULT_CONFIG): IInnerTreeNode[] => {
      if (node.isLeaf) {
        return [];
      }
      if (node.id && nodeMap.has(node.id)) {
        const cacheNode = nodeMap.get(node.id);
        if (cacheNode) {
          return cacheNode;
        }
      }
      const getInnerExpendedTree = (): ComputedRef<IInnerTreeNode[]> => {
        return computed(() => {
          let excludeNodes: IInnerTreeNode[] = [];
          const result = [];
          for (let i = 0, len = data?.value.length; i < len; i++) {
            const item = data?.value[i];
            if (excludeNodes.map((innerNode) => innerNode.id).includes(item.id)) {
              continue;
            }
            if (item.expanded !== true && !item.isLeaf) {
              excludeNodes = getChildren(item);
            }
            result.push(item);
          }
          return result;
        });
      };
      const result = [];
      const config = { ...DEFAULT_CONFIG, ...userConfig };
      const treeData = config.expanded ? getInnerExpendedTree() : data;
      const startIndex = treeData.value.findIndex((item) => item.id === node.id);

      for (let i = startIndex + 1; i < treeData.value.length && getLevel(node) < treeData.value[i].level; i++) {
        if (config.recursive) {
          result.push(treeData.value[i]);
        } else if (getLevel(node) === treeData.value[i].level - 1) {
          result.push(treeData.value[i]);
        }
      }
      if (node.id) {
        nodeMap.set(node.id, result);
      }
      return result;
    };

    const getParent = (node: IInnerTreeNode): IInnerTreeNode => {
      return data.value.find((item) => item.id === node.parentId);
    };

    const getExpendedTree = (): ComputedRef<IInnerTreeNode[]> => {
      return computed(() => {
        let excludeNodes: IInnerTreeNode[] = [];
        const result = [];
        for (let i = 0, len = data?.value.length; i < len; i++) {
          const item = data?.value[i];
          if (excludeNodes.map((node) => node.id).includes(item.id)) {
            continue;
          }
          if (item.expanded !== true) {
            excludeNodes = getChildren(item);
          }
          result.push(item);
        }
        return result;
      });
    };

    const getIndex = (node: IInnerTreeNode): number => {
      if (!node) {
        return -1;
      }

      return data.value.findIndex((item) => item.id === node.id);
    };

    const getNode = (node: IInnerTreeNode): IInnerTreeNode => {
      return data.value.find((item) => item.id === node.id);
    };

    const setNodeValue = (node: IInnerTreeNode, key: keyof IInnerTreeNode, value: valueof<IInnerTreeNode>): void => {
      nodeMap.clear();
      if (getIndex(node) !== -1) {
        data.value[getIndex(node)][key] = value;
      }
    };

    const setTree = (newTree: ITreeNode[]): void => {
      nodeMap.clear();
      data.value = generateInnerTree(newTree);
    };

    const getTree = () => {
      return data.value;
    };

    onUnmounted(() => {
      nodeMap.clear();
    });

    return {
      getLevel,
      getChildren,
      getParent,
      getExpendedTree,
      getIndex,
      getNode,
      setNodeValue,
      setTree,
      getTree,
    };
  };
}
