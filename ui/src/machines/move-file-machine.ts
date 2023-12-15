import { assign, createMachine } from 'xstate';

import type { Model } from '~/services/athenaeum';

type MoveFileMachineEvents =
    | { type: 'MIGRATE' }
    | { type: 'SET_DESTINATION'; model: Model | null }
    | { type: 'CREATE_AND_MOVE' }
    | { type: 'CANCEL' }
    | { type: 'CONFIRM' }
    | { type: 'SUCCESS' };

interface MoveFileMachineContext {
    destinationModel: Model | null;
}

interface MoveFileMachine {
    context: MoveFileMachineContext;
    events: MoveFileMachineEvents;
}

export const moveFileMachine = createMachine({
    id: 'move-file',
    initial: 'idle',
    types: {} as MoveFileMachine,
    context: {
        destinationModel: null,
    },
    states: {
        idle: {
            on: {
                MIGRATE: 'migrate',
                CREATE_AND_MOVE: 'createAndMove',
            },
        },
        migrate: {
            on: {
                CANCEL: 'idle',
                CONFIRM: {
                    guard: ({ context }) => context.destinationModel !== null,
                    target: 'migrating',
                },
                SET_DESTINATION: {
                    actions: assign(({ event }) => ({
                        destinationModel: event.model,
                    })),
                },
            },
        },
        migrating: {
            on: { SUCCESS: 'idle' },
        },
        createAndMove: {
            on: { CANCEL: 'idle', CONFIRM: 'moving' },
        },
        moving: {
            on: { SUCCESS: 'idle' },
        },
    },
});
