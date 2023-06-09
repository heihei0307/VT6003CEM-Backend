import {Pets} from '../entities/pets'
import database from "../utils/database"
import {PetPhotos} from "../entities/petPhotos";
import {Users} from "../entities/users";

const getAll = async () => {
    const dataRepository = database.AppDataSource.getRepository(Pets)
    return await dataRepository.find({
        relations: {pet_photos: true, created_by: true},
        select: {created_by: {id: true, nickname: true}},
        where: {is_active: true}
    })
}

const getById = async (id: number) => {
    const dataRepository = database.AppDataSource.getRepository(Pets)
    return await dataRepository.findOne({
        where: {id: id, is_active: true},
        relations: {pet_photos: true, created_by: true},
        select: {created_by: {id: true, nickname: true}}
    })
}

const create = async (data: Pets) => {
    const dataRepository = database.AppDataSource.getRepository(Pets)
    await dataRepository.save(data)
    if (data.pet_photos && data.pet_photos.length > 0) {
        for (const item of data.pet_photos) {
            item.pet = data;
            const petPhotos = database.AppDataSource.getRepository(PetPhotos);
            await petPhotos.save(item);
        }
    }
    return await getById(data.id)
}

const update = async (id: number, data: Pets) => {
    const dataRepository = database.AppDataSource.getRepository(Pets)
    const findById = await getById(id)
    if (findById != null) {
        if (data.updated_by.id != findById.created_by.id)
            return null
        const updateData = {...findById, ...data}
        await dataRepository.save(updateData)
        if (findById.pet_photos.length > 0) {
            const petPhotos = database.AppDataSource.getRepository(PetPhotos);
            await petPhotos.remove(findById.pet_photos)
        }
        if (data.pet_photos && data.pet_photos.length > 0) {
            for (const item of data.pet_photos) {
                item.pet = updateData;
                const petPhotos = database.AppDataSource.getRepository(PetPhotos);
                await petPhotos.save(item);
            }
        }
        return await getById(findById.id)
    } else
        return null
}

const remove = async (id: number, currentUser: Users) => {
    const dataRepository = database.AppDataSource.getRepository(Pets)
    const findById = await getById(id)
    if (findById != null) {
        if (currentUser.id != findById.created_by.id)
            return null
        findById.is_active = false
        findById.updated_by = currentUser
        return await dataRepository.save(findById)
    } else
        return null
}

export default {getAll, getById, create, update, remove}