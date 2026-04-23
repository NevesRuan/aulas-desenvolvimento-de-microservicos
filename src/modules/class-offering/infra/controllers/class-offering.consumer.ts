import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class ClassOfferingConsumer implements OnModuleInit {
  constructor(@Inject('CLASS_OFFERING_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    // Isso garante que a conexão microserviço está estabelecida
    // quando o módulo inicia, criando a fila no RabbitMQ
    await this.client.connect();
  }

  @EventPattern('class_offering.created')
  async handleClassOfferingCreated(data: any) {
    console.log('✅ Class offering created:', data);
    // Aqui você pode processar a mensagem, como enviar email, notificar, etc.
  }

  @EventPattern('class_offering.updated')
  async handleClassOfferingUpdated(data: any) {
    console.log('✅ Class offering updated:', data);
    // Processar atualização
  }
}