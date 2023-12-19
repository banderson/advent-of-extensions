import { Reducer, useCallback, useReducer } from "react";
import { runValidation } from "./validation";
import { produce } from "immer";

interface FormState {
  success: boolean | null;
  fields: {};
  values: {};
  dirty: {};
  touched: {};
}

type Action =
  | {
      type: "touch";
      payload: Pick<FormState, "touched"> & { fieldName: string };
    }
  | {
      type: "change";
      payload: Pick<FormState, "values" | "dirty"> & { fieldName: string };
    }
  | {
      type: "submit";
      payload: Pick<FormState, "success" | "fields">;
    }
  | { type: "reset" };

const defaultState: FormState = {
  success: false,
  fields: {},
  values: {},
  dirty: {},
  touched: {},
};

const validationReducer: Reducer<FormState, Action> = produce(
  (draft, action) => {
    switch (action.type) {
      case "touch":
        const { fieldName } = action.payload;
        draft.touched[fieldName] = true;
        draft.fields[fieldName] = runValidation(
          draft.values,
          draft.touched
        ).fields[fieldName];
        break;

      case "change":
        const { fieldName: field } = action.payload;
        draft.values[field] = action.payload.values[field];
        draft.dirty[field] = true;
        draft.fields[field] = runValidation(draft.values, draft.touched).fields[
          field
        ];
        break;

      case "submit":
        draft.success = action.payload.success!;
        draft.fields = action.payload.fields;
        break;

      case "reset":
        draft = defaultState;
        break;
      default:
        draft = draft;
    }
  }
);

interface RegisterProps {
  onChange?: (evt: any) => any;
  onBlur?: (evt: any) => any;
}

const identity = (x) => x;

export const useProjectFormValidation = () => {
  const [state, dispatch] = useReducer<typeof validationReducer>(
    validationReducer,
    defaultState
  );

  const handleSubmit = useCallback(
    (handler) =>
      (evt, ...args) => {
        const update: Action = {
          type: "submit",
          payload: { ...runValidation(state.values) },
        };
        dispatch(update);

        // manually generate state to not wait for next render
        const { success } = validationReducer(state, update);
        if (success) {
          return handler(state.values, ...args);
        }
      },
    [state]
  );

  const handleReset = useCallback(
    (handler) =>
      (evt, ...args) => {
        dispatch({ type: "reset" });
        return handler(state.values, ...args);
      },
    [state]
  );

  const reset = useCallback(() => {
    return dispatch({ type: "reset" });
  }, []);

  const register = useCallback(
    (fieldName: string, props: RegisterProps = {}) => {
      let fieldState = {};
      if (state.success === false && Array.isArray(state.fields[fieldName])) {
        const fieldError = state.fields[fieldName];
        fieldState = {
          error: true,
          validationMessage: fieldError[0],
        };
      }

      const { onChange = identity, onBlur = identity } = props;

      return {
        name: fieldName,
        ...fieldState,
        onBlur: (evt) => {
          dispatch({
            type: "touch",
            payload: {
              fieldName,
              touched: {
                [fieldName]: true,
              },
            },
          });
          onBlur(evt);
        },
        onChange: (evt) => {
          const value = onChange(evt);
          dispatch({
            type: "change",
            payload: {
              fieldName,
              values: {
                [fieldName]: value,
              },
              dirty: {
                [fieldName]: true,
              },
            },
          });
        },
      };
    },
    [state]
  );

  return {
    register,
    handleSubmit,
    handleReset,
    isValid: !!state.success,
    getValues: () => state.values,
    reset,
    validation: state,
  };
};
