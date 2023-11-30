import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';
import { vi } from 'vitest';

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate; // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
    return aggregate;
  }
}

describe('Domain events', () => {
  it('Should be able to dispatch abd listen to events', () => {
    const callbackSpy = vi.fn();
    // Subscriber cadastrado (ouvindo um evento de "reposta por exemplo")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Estou criando uma resposta porem sem salvar no banco
    const aggregate = CustomAggregate.create();

    // asseguro que o evento foi criado
    expect(aggregate.domainEvents).toHaveLength(1);

    // salvo no banco e disparo o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id);
    // O subscribe ouve o evento e faz o que tiver que fazer
    expect(callbackSpy).toBeCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
