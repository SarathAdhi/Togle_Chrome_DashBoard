import { addDoc, getDocs, query, where } from "firebase/firestore";

export const FBAddDoc = async (object, collectionRef) => {
  await addDoc(collectionRef, object);
};

export const FBWhere = async ({ collectionRef, fieldName, fieldValue }) => {
  const _query = query(collectionRef, where(fieldName, "==", fieldValue));
  const querySnapshot = await getDocs(_query);
  const details = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  return details;
};
