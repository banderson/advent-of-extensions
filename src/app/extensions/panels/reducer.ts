import { Reducer, useCallback, useReducer } from "react";
import { runValidation } from "./validation";

interface FormState {
  success: boolean | null;
  fields: any;
  values: any;
  dirty: any;
  touched: any;
}

type Action =
  | { type: "touch"; payload: Partial<FormState> & { fieldName: string } }
  | { type: "change"; payload: Partial<FormState> & { fieldName: string } }
  | { type: "submit" }
  | { type: "reset" };

const defaultState: FormState = {
  success: null,
  fields: {},
  values: {},
  dirty: {},
  touched: {},
};

const validationReducer: Reducer<FormState, Action> = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case "touch":
      const nextTouched = {
        ...state.touched,
        ...action.payload.touched,
      };
      return {
        ...state,
        touched: nextTouched,
        ...runValidation(state.values, nextTouched),
      };
    case "change":
      return {
        ...state,
        values: {
          ...state.values,
          ...action.payload.values,
        },
        dirty: {
          ...state.dirty,
          ...action.payload.dirty,
        },
        ...runValidation(state.values, state.touched),
      };
    case "submit":
      return {
        ...state,
        ...runValidation(state.values),
      };
    case "reset":
      return defaultState;
    default:
      return state;
  }
};

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
        dispatch({ type: "submit" });
        // manually generate state to not wait for next render
        const { success } = validationReducer(state, { type: "submit" });
        if (success) {
          return handler(state.values, ...args);
        }
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
    isValid: !!state.success,
    getValues: () => state.values,
    reset,
    validation: state,
  };
};
