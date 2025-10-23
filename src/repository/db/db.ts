import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize
} from 'sequelize';

const sequelize = new Sequelize(`sqlite:${process.env.DB_FILE}`, {
  dialect: 'sqlite'
});

export class UserRecord extends Model<
  InferAttributes<UserRecord>,
  InferCreationAttributes<UserRecord>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone: string;
  declare address: string;
}

UserRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { sequelize, tableName: 'Users' }
);

export class VaccinationRecord extends Model<
  InferAttributes<VaccinationRecord>,
  InferCreationAttributes<VaccinationRecord>
> {
  declare id: CreationOptional<string>;
  declare date: Date;
  declare vaccine: string;
  declare note: string;
  declare petId: string;
  declare pet: NonAttribute<PetRecord>;
}

VaccinationRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    vaccine: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false
    },
    petId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Pets',
        key: 'id'
      }
    }
  },
  { sequelize, tableName: 'Vaccinations' }
);

export class AllergyRecord extends Model<
  InferAttributes<AllergyRecord>,
  InferCreationAttributes<AllergyRecord>
> {
  declare id: CreationOptional<string>;
  declare allergy: string;
  declare severity: string;
  declare reaction: string;
  declare note?: string;
  declare petId: string;
  declare pet: NonAttribute<PetRecord>;
}
AllergyRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    allergy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reaction: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    },
    petId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Pets',
        key: 'id'
      }
    }
  },
  { sequelize, tableName: 'Allergies' }
);

export class PetRecord extends Model<
  InferAttributes<PetRecord>,
  InferCreationAttributes<PetRecord>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare type: string;
  declare gender: string;
  declare breed?: string;
  declare dateOfBirth: Date;
  declare ownerId: string;
  declare owner: NonAttribute<UserRecord>;
  declare vaccinations?: NonAttribute<VaccinationRecord>[];
  declare allergies?: NonAttribute<AllergyRecord>[];
  declare insurance?: {
    provider?: string;
    policyNumber?: string;
  };
  declare veterinarian?: string;
}

PetRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['male', 'female', 'other'],
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    insurance: {
      type: DataTypes.JSON,
      allowNull: true
    },
    veterinarian: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  { sequelize, tableName: 'Pets' }
);

VaccinationRecord.belongsTo(PetRecord, { foreignKey: 'petId', as: 'pet' });
AllergyRecord.belongsTo(PetRecord, { foreignKey: 'petId', as: 'pet' });
PetRecord.belongsTo(UserRecord, { foreignKey: 'ownerId', as: 'owner' });
PetRecord.hasMany(VaccinationRecord, {
  foreignKey: 'petId',
  as: 'vaccinations',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
PetRecord.hasMany(AllergyRecord, {
  foreignKey: 'petId',
  as: 'allergies',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
UserRecord.hasMany(PetRecord, {
  foreignKey: 'ownerId',
  as: 'pets',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

let isSynced = false;
const syncDb = async () => {
  await UserRecord.sync({});
  if ((await UserRecord.count()) === 0) {
    await UserRecord.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      phone: '1234567890',
      address: '123 Main St, Anytown, USA'
    });
  }

  await PetRecord.sync({});
  await VaccinationRecord.sync({});
  await AllergyRecord.sync({});
  isSynced = true;
};

export const getPetsDb = async () => {
  // Just to simplify init of db. NOT PRODUCTION READY
  if (!isSynced) {
    await syncDb();
  }

  return PetRecord;
};

export const getVaccinationsDb = async () => {
  // Just to simplify init of db. NOT PRODUCTION READY
  if (!isSynced) {
    await syncDb();
  }

  return VaccinationRecord;
};

export const getAllergiesDb = async () => {
  // Just to simplify init of db. NOT PRODUCTION READY
  if (!isSynced) {
    await syncDb();
  }

  return AllergyRecord;
};
export const getUsersDb = async () => {
  // Just to simplify init of db. NOT PRODUCTION READY
  if (!isSynced) {
    await syncDb();
    isSynced = true;
  }

  return UserRecord;
};

export const getSequelize = async () => {
  // Just to simplify init of db. NOT PRODUCTION READY
  if (!isSynced) {
    await syncDb();
    isSynced = true;
  }

  return sequelize;
};
