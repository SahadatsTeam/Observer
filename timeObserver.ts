import * as newrelic from 'newrelic';

export function observeAsyncTime(indicator?: string) {
    return (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<(...params: any[]) => Promise<any>>
    ) => {
        const method = descriptor.value;
        const key: string = indicator
            ? `Custom/${indicator}`
            : `Custom/${target.constructor.name}/${propertyKey}`;

        descriptor.value = async function() {
            const startTime = new Date();
            const result = await method.call(this, ...arguments);
            const endTime = new Date();
            const processTime = +endTime - +startTime;

            // Record to NewRelic Custom Metric for analysis
            newrelic.recordMetric(key, processTime);
            return result;
        };
    };
}

export function observeTime(indicator?: string) {
    return (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<(...params: any[]) => any>
    ) => {
        const method = descriptor.value;
        const key: string = indicator
            ? `Custom/${indicator}`
            : `Custom/${target.constructor.name}/${propertyKey}`;

        descriptor.value = function() {
            const startTime = new Date();
            const result = method.call(this, ...arguments);
            const endTime = new Date();
            const processTime = +endTime - +startTime;

            // Record to NewRelic Custom Metric for analysis
            newrelic.recordMetric(key, processTime);
            return result;
        };
    };
}
