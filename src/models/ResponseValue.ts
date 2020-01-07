export interface ResponseValue {
    id: number;
    text: string;
    displayText?: string;
};

export namespace CommonResponseValues {

    export const None: ResponseValue = {
        id: 0,
        text: 'None'
    };

    export const Yes: ResponseValue = {
        id: 1,
        text: 'Yes'
    };

    export const No: ResponseValue = {
        id: 2,
        text: 'No'
    };

}
