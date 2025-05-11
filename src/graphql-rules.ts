import { ValidationContext, ASTVisitor, GraphQLError } from 'graphql';

export function limitTopLevelFields(maxFields: number) {
  return function validationRule(context: ValidationContext): ASTVisitor {
    return {
      OperationDefinition(node) {
        const topLevelSelections = node.selectionSet.selections.length;
        if (topLevelSelections > maxFields) {
          context.reportError(
            new GraphQLError(
              `Много запросов, максимум ${maxFields}, но используется ${topLevelSelections}.`,
              { nodes: [node] },
            ),
          );
        }
      },
    };
  };
}

export function limitOperationCount(maxOperations: number) {
  return function validationRule(context: ValidationContext): ASTVisitor {
    let operationCount = 0;

    return {
      OperationDefinition(node) {
        operationCount++;
        if (operationCount > maxOperations) {
          context.reportError(
            new GraphQLError(
              `Много операций, максимум  ${maxOperations}, но используется ${operationCount}.`,
              { nodes: [node] },
            ),
          );
        }
      },
    };
  };
}
