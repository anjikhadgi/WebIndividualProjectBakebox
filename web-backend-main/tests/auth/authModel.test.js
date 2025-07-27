const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Define the mock Credential model
const CredentialMock = dbMock.define('Credential', {
    id: 1,
    username: 'dipika',
    password: '123456',
    role: 'user'
});

describe('Credential Model', () => {
    it('should create a new credential', async () => {
        const credential = await CredentialMock.create({
            username: 'dipika',
            password: '123456',
            role: 'user'
        });

        expect(credential.username).toBe('dipika');
        expect(credential.password).toBe('123456');
        expect(credential.role).toBe('user');
    });

    it('should update a credential', async () => {
        const credential = await CredentialMock.create({
            username: 'dipika',
            password: '123456',
            role: 'user'
        });

        await credential.update({
            password: 'new123456'
        });

        expect(credential.password).toBe('new123456');
    });

    it('should delete a credential', async () => {
        const credential = await CredentialMock.create({
            username: 'dipika',
            password: '123456',
            role: 'user'
        });

        await credential.destroy();

        const foundCredential = await CredentialMock.findByPk(credential.id);
        expect(foundCredential).toBeNull();
    });
});